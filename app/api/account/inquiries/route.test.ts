import {beforeEach,describe,expect,it,vi} from "vitest";

const mocks=vi.hoisted(()=>({identity:vi.fn(),profile:vi.fn(),inquiries:vi.fn(),summary:vi.fn(),create:vi.fn(),send:vi.fn()}));
vi.mock("@/lib/customer-identity.server",()=>({getCustomerIdentity:mocks.identity}));
vi.mock("@/lib/customer-account-db",()=>({getCustomerProfile:mocks.profile,getCustomerInquiries:mocks.inquiries,getCustomerInquirySummary:mocks.summary}));
vi.mock("@/lib/catalog-db",()=>({createProductInquiry:mocks.create}));
vi.mock("resend",()=>({Resend:class {emails={send:mocks.send};}}));

const identity={userId:"user_1",email:"ana@example.com",verifiedEmails:["ana@example.com"],firstName:"Ana",lastName:"Ruiz"};
const profile={userId:"user_1",email:"ana@example.com",customerType:"company",contactName:"Ana Ruiz",legalName:"Montajes Norte SL",taxIdType:"company_nif",taxId:"B99286320",phone:"600123123",addressLine1:"Mayor 10",addressLine2:"",postalCode:"28001",city:"Madrid",province:"Madrid",countryCode:"ES",privacyAccepted:true,privacyAcceptedAt:"2026-01-01",createdAt:"2026-01-01",updatedAt:"2026-01-01"};

describe("customer inquiry APIs",()=>{
  beforeEach(()=>{vi.clearAllMocks();vi.stubEnv("RESEND_API_KEY","test");mocks.identity.mockResolvedValue(null);mocks.profile.mockResolvedValue(null);mocks.inquiries.mockResolvedValue([]);mocks.summary.mockResolvedValue({total:0,active:0});mocks.send.mockResolvedValue({data:{id:"mail"},error:null});});
  it("rejects signed-out account reads and submissions",async()=>{
    const account=await import("./route");const submission=await import("../../product-inquiries/route");
    expect((await account.GET()).status).toBe(401);
    expect((await submission.POST(new Request("http://localhost/api/product-inquiries",{method:"POST",body:"{}"}))).status).toBe(401);
  });
  it("returns only the signed-in customer's public inquiry DTO",async()=>{
    mocks.identity.mockResolvedValue(identity);mocks.summary.mockResolvedValue({total:1,active:1});mocks.inquiries.mockResolvedValue([{id:"MP-1",kind:"product",product_id:"p1",product_name:"Pinza",message:"Necesito oferta",documents:[{name:"plano.pdf",url:"https://blob.example/plano.pdf",size:1}],public_status:"reviewing",admin_notes:"internal",profile_snapshot:{taxId:"secret"},created_at:"2026-01-01",updated_at:"2026-01-02"}]);
    const {GET}=await import("./route");const response=await GET();const body=await response.json();
    expect(mocks.inquiries).toHaveBeenCalledWith(identity.userId);expect(body).toMatchObject({summary:{total:1},inquiries:[{reference:"MP-1",status:"reviewing",productName:"Pinza"}]});
    expect(JSON.stringify(body)).not.toContain("internal");expect(JSON.stringify(body)).not.toContain("secret");
  });
  it("requires a complete profile before submission",async()=>{
    mocks.identity.mockResolvedValue(identity);mocks.profile.mockResolvedValue({...profile,phone:""});
    const {POST}=await import("../../product-inquiries/route");const response=await POST(new Request("http://localhost/api/product-inquiries",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({kind:"product",productId:"p1",productName:"Pinza",message:"Necesito una oferta completa",documents:[],consent:true,website:""})}));
    expect(response.status).toBe(409);await expect(response.json()).resolves.toMatchObject({missing:expect.arrayContaining(["phone"])});expect(mocks.create).not.toHaveBeenCalled();
  });
  it("creates an owned inquiry from the server profile and ignores spoofed identity",async()=>{
    mocks.identity.mockResolvedValue(identity);mocks.profile.mockResolvedValue(profile);
    const {POST}=await import("../../product-inquiries/route");const response=await POST(new Request("http://localhost/api/product-inquiries",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({kind:"product",productId:"p1",productName:"Pinza",name:"Impostor",email:"fake@example.com",message:"Necesito una oferta completa",documents:[],consent:true,website:""})}));
    expect(response.status).toBe(200);expect(mocks.create).toHaveBeenCalledWith(expect.objectContaining({userId:identity.userId,email:identity.email,name:profile.contactName,company:profile.legalName,profileSnapshot:expect.objectContaining({taxId:profile.taxId})}));
    await expect(response.json()).resolves.toMatchObject({ok:true,reference:expect.stringMatching(/^MP-TIENDA-/),inquiry:{status:"received"}});
  });
});
