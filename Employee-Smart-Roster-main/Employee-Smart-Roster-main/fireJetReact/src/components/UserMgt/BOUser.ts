export interface User {
    UID: number;
    fullName: string;
    email: string;
    nric?: string;
    hpNo?: string;
    role: string;
    isSuspended: boolean;
    createdAt?: string;
    lastUpdate?: string;
    reasonOfSuspend?: string;
  }