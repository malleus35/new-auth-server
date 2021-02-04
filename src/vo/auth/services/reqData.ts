interface data {
    [attr: string]: any;
}
interface decoded {
    idx?: number;
}
interface params {
    [attr: string]: any;
}
export interface ReqData {
    data?: data;
    decoded?: decoded;
    params?: params;
}
export interface AuthReqData {
    data: data;
    decoded?: decoded;
    params?: params;
}
export interface ParamsStrictReqData extends ReqData {
    params: params;
}
export interface StrictReqData extends ReqData {
    data: data;
    decoded: decoded;
}
export interface AllStrictReqData extends StrictReqData {
    params: params;
}
