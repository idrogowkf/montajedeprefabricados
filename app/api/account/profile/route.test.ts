import {readFileSync} from "node:fs";
import {join} from "node:path";
import {beforeEach,describe,expect,it,vi} from "vitest";

const mocks=vi.hoisted(()=>({
  identity:vi.fn(),getProfile:vi.fn(),upsertProfile:vi.fn(),link:vi.fn(),
}));

vi.mock("@/lib/customer-identity.server",()=>({getCustomerIdentity:mocks.identity}));
vi.mock("@/lib/customer-account-db",()=>({
  getCustomerProfile:mocks.getProfile,upsertCustomerProfile:mocks.upsertProfile,linkHistoricalInquiries:mocks.link,
}));

const validProfile={
  customerType:"company",contactName:"Ana Ruiz",legalName:"Montajes Norte SL",taxIdType:"company_nif",taxId:"B99286320",
  phone:"+34 600 123 123",addressLine1:"Calle Mayor 10",addressLine2:"",postalCode:"28001",city:"Madrid",province:"Madrid",countryCode:"ES",privacyAccepted:true,
};

describe("customer profile API",()=>{
  beforeEach(()=>{vi.clearAllMocks();mocks.identity.mockResolvedValue(null);mocks.getProfile.mockResolvedValue(null);mocks.link.mockResolvedValue(0);});

  it("returns 401 for a signed-out caller",async()=>{
    const {GET,PUT}=await import("./route");
    expect((await GET()).status).toBe(401);
    expect((await PUT(new Request("http://localhost/api/account/profile",{method:"PUT",body:"{}"}))).status).toBe(401);
  });

  it("returns field errors and never persists an incomplete profile",async()=>{
    mocks.identity.mockResolvedValue({userId:"user_1",email:"ana@example.com",verifiedEmails:["ana@example.com"],firstName:"Ana",lastName:"Ruiz"});
    const {PUT}=await import("./route");
    const response=await PUT(new Request("http://localhost/api/account/profile",{method:"PUT",headers:{"content-type":"application/json"},body:JSON.stringify({...validProfile,phone:"",taxId:"bad"})}));
    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({ok:false,errors:{phone:expect.any(String),taxId:expect.any(String)}});
    expect(mocks.upsertProfile).not.toHaveBeenCalled();
  });

  it("uses the server identity, links every verified address and returns completion",async()=>{
    const identity={userId:"user_1",email:"principal@example.com",verifiedEmails:["principal@example.com","compras@example.com"],firstName:"Ana",lastName:"Ruiz"};
    const saved={...validProfile,userId:identity.userId,email:identity.email,privacyAcceptedAt:new Date().toISOString(),createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};
    mocks.identity.mockResolvedValue(identity);mocks.upsertProfile.mockResolvedValue(saved);mocks.link.mockResolvedValue(3);
    const {PUT}=await import("./route");
    const response=await PUT(new Request("http://localhost/api/account/profile",{method:"PUT",headers:{"content-type":"application/json"},body:JSON.stringify({...validProfile,email:"attacker@example.com",publicMetadata:{taxId:"should-not-exist"}})}));
    expect(response.status).toBe(200);
    expect(mocks.upsertProfile).toHaveBeenCalledWith(identity.userId,identity.email,validProfile);
    expect(mocks.link).toHaveBeenCalledWith(identity.userId,identity.verifiedEmails);
    await expect(response.json()).resolves.toMatchObject({ok:true,profile:{email:identity.email},completion:{complete:true},linkedInquiries:3});
  });

  it("keeps account routing protected and global sign-in copy customer-neutral",()=>{
    const middleware=readFileSync(join(process.cwd(),"middleware.ts"),"utf8");
    const layout=readFileSync(join(process.cwd(),"app/layout.tsx"),"utf8");
    expect(middleware).toContain('createRouteMatcher(["/mi-cuenta(.*)","/api/account(.*)"])');
    expect(middleware).toContain('new URL("/iniciar-sesion",request.url)');
    expect(layout).toContain("Accede a tu cuenta");
    expect(layout).not.toContain("Acceso reservado a la administración");
    expect(layout).not.toContain("correo administrativo");
  });
});
