type Hash = string;
type Signature = string;
type HolochainError = object;
type PackageRequest = object;

/*============================================
=            Holochain Data Types            =
============================================*/

interface Header {
  Type: string;
  Time: string;
  HeaderLink: Hash;
  EntryLink: Hash;
  TypeLink: Hash;
  Sig: Signature;
  Change: Hash;
}

interface GetResponse {
  Entry?: any;
  EntryType?: string;
  Sources?: Hash[]; 
}

interface GetLinksResponse {
  Hash: Hash;
  Entry?: any;
  EntryType?: string;
  Tag?: string;
  Source?: Hash;
}

interface QueryResponse {
  Hash?: string
  Entry?: any
  Header?: Header
}

interface BridgeStatus {
  Side: number;
  CalleeName?: string;
  CalleeApp?: Hash;
  Token?: string;
}


/*=====  End of Holochain Data Types  ======*/


interface HolochainSystemGlobals {
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

interface HolochainAppGlobals {
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

declare function property(name: string): string;
declare function makeHash (entryType: string, entryData: any): Hash;
declare function debug(value: any): void;
declare function call(zomeName: string, functionName: string, arguments: string | object): any;
declare function bridge(appDNAHash: Hash, zomeName: string, functionName: string, arguments: string | object): any;
declare function getBridges(): BridgeStatus[];
declare function sign(doc: string): string;
declare function verifySignature(signature: string, data: string, pubKey: string): boolean;
declare function commit(entryType: string, entryData: string | object): Hash;
declare function get(hash: Hash, options?: object): GetResponse | any;
declare function getLinks(base: Hash, tag: string, options?: object): GetLinksResponse[];
declare function update(entryType: string, entryData: string | object, replaces: Hash) : Hash;  
declare function updateAgent(options: object): Hash;
declare function remove(entryHash: Hash, message: string): Hash;
declare function query(options?: object): QueryResponse[] | any[];
declare function send(to: Hash, message: object, options?: object): any;
declare function bundleStart(timeout: number, userParam: any): void;
declare function bundleClose(commit: boolean): void;


declare var HC: HolochainSystemGlobals;
declare var App: HolochainAppGlobals;

