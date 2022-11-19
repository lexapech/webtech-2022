import {SocketIoConfig} from "ngx-socket-io";

export default class AppSettings {
    public static API_ENDPOINT="http://localhost:3000/userapi/"
    public static AUTH_ENDPOINT="http://localhost:3000/api/"
    public static SOCKET_CONFIG: SocketIoConfig = { url: 'http://localhost:3100', options: {withCredentials: true} };
}