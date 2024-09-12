

const createCookie = (userid: string) => {
    
    return `Authorization=${userid}; HttpOnly; Max-Age=86400; Path=/; SameSite=None; Secure;`;

}


export default createCookie;
