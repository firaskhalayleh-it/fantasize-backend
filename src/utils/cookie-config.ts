

const createCookie = (userid: string,name: string) => {
    
    return `${name}=${userid}; HttpOnly; Max-Age=86400; Path=/; SameSite=None; Secure;`;

}


export default createCookie;
