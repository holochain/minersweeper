// holochain type definitions


export type Hash = string;
export type Signature = string;
export type HolochainError = object;
export type PackageRequest = object;

/*============================================
=            Holochain Data Types            =
============================================*/

export interface Header {
  Type: string;
  Time: string;
  HeaderLink: Hash;
  EntryLink: Hash;
  TypeLink: Hash;
  Sig: Signature;
  Change: Hash;
}

export interface GetResponse {
  Entry?: any;
  EntryType?: string;
  Sources?: Hash[];
}

export interface GetLinksResponse {
  Hash: Hash;
  Entry?: any;
  EntryType?: string;
  Tag?: string;
  Source?: Hash;
}

export interface QueryResponse {
  Hash?: string
  Entry?: any
  Header?: Header
}

export interface BridgeStatus {
  Side: number;
  CalleeName?: string;
  CalleeApp?: Hash;
  Token?: string;
}


/*=====  End of Holochain Data Types  ======*/


export interface HolochainSystemGlobals {
  Version: string;
  HashNotFound: any;
  Status: any;
  GetMask: any;
  LinkAction: any;
  PkgReq: any;
  Bridge: any;
  SysEntryType: any;
  BundleCancel: any;
}

export interface HolochainAppGlobals {
  Name: string;
  DNA: {
    Hash: Hash;
  };
  Key: {
    Hash: Hash;
  }
  Agent: {
    Hash: Hash;
    TopHash: Hash;
    String: string;
  }
}



