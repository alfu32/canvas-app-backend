export type HttpMethod="GET"|"POST"|"PATCH"|"PUT"|"DELETE"|"TRACE"|"OPTIONS"
export type ServiceConfigItemDescriptor = {
    method:HttpMethod,
    path:string,
    params?:any,
    body?:any,
    query?:string,
    response?:any
}
export type ServiceConfigResult = {
    [pathmatch:string]:ServiceConfigItemDescriptor
}