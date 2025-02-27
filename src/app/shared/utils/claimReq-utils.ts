export const claimReq = {
    adminOnly: (c: any) => c.role == "Admin",
    adminOrRecruteur: (c: any) => c.role == "Admin" || c.role == "Recruteur",
    Recruteur: (c: any) => c.role=="Recruteur",
    Candidate: (c: any) => c.role=="Candidate",
  }