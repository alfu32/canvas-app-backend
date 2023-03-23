export type HttpMethod="GET"|"POST"|"PATCH"|"PUT"|"DELETE"|"TRACE"|"OPTIONS"
export type ServiceConfigItemDescriptor = {
    name:string,
    folder:string,
    method:HttpMethod,
    path:string,
    params?:any,
    body?:any,
    query?:string,
    response?:any,
    
}
export type ServiceConfigResult = {
    [pathmatch:string]:ServiceConfigItemDescriptor
}
export type map<T>={[key:string]:T}
export function jsonToQueryString(json:map<any>):string{
    return ""
}