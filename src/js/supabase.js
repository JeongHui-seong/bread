import supabase from "./supabaseClient.js";

export default class DB {
    constructor() {
        this.supabase = supabase;
        this.userInfo;
    }

    async fetchUser({id, pw, userKey}) {
        try {
            let query = this.supabase.from("users").select()
            if (userKey) query = query.eq("user_key", userKey);
            if (id) query = query.eq("user_id", id);
            if (id && pw) query = query.eq("user_id", id).eq("user_pw", pw);

            const { data } = await query;
            return data;
        }
        catch (err) {
            console.log(err);
        }
    }

    async searchUser({userName}) {
        try{
            let query = this.supabase.from("users").select()
            if (userName) query = query.ilike("user_name", `%${userName}%`);

            const { data } = await query;
            return data;
        }
        catch (err) {
            console.log(err)
        }
    }

    async InsertUser(id, pw, name, pn) {
        try {
            const { data } = await this.supabase
                .from("users")
                .insert([{ user_id: id, user_pw: pw, user_name: name, user_phonenumber: pn }])
                .select()
        }
        catch (err) {
            console.log(err);
        }
    }

    async DBIDCheck(id) {
        this.userInfo = await this.fetchUser({id});
        if (this.userInfo.length == 0) {
            alert('아이디 사용 가능');
            return true;
        } else {
            alert('아이디 사용 불가능');
            return false;
        }
    }

    async insertPost(content) {
        try {
            const { data } = await this.supabase
                .from("posts")
                .insert([{ user_key: sessionStorage.getItem("userkey"), post_content: content }])
            return true;
        }
        catch (err) {
            console.log(err);
            return false;
        }
    }

    async fetchLikes(postID) {
        try {
            const { data } = await this.supabase
                .from("likes")
                .select("*")
                .eq("post_id", postID);

            return data;
        }
        catch (err) {
            console.log(err);
        }
    }

    async realtimeFetchLikes(event, option = null) {
        try {
            this.supabase
                .channel("likes")
                .on("postgres_changes",
                    {
                        event: "*",
                        schema: "public",
                        table: "likes",
                    }, async (payload) => {
                        const newID = payload.new?.post_id;
                        const oldID = payload.old?.post_id;
                        if (!option || newID == option || oldID == option){
                            await event();
                            // console.log(payload);
                        }
                    })
                .subscribe();
        }
        catch (err) {
            console.log(err);
        }
    }

    async realtimeFetchComments(event, option = null) {
        try {
            this.supabase
                .channel("comments")
                .on("postgres_changes",
                    {
                        event: "*",
                        schema: "public",
                        table: "comments",
                    }, async (payload) => {
                        const newID = payload.new?.post_id;
                        const oldID = payload.old?.post_id;
                        if (!option || newID == option || oldID == option){
                            await event();
                            // console.log(payload);
                        }
                    })
                .subscribe();
        }
        catch (err) {
            console.log(err);
        }
    }

    async insertLikes(postID, userKey) {
        try {
            const { data } = await this.supabase
                .from("likes")
                .insert([{ post_id: postID, user_key: userKey }])
        }
        catch (err) {
            console.log(err);
        }
    }

    async deleteLikes(postID, userkey) {
        try {
            const { error } = await this.supabase
                .from("likes")
                .delete()
                .eq('post_id', postID)
                .eq('user_key', userkey)
        }
        catch (err) {
            console.log(err)
        }
    }

    async fetchContent({postID,userKey}) {
        try {
            let query = this.supabase
                        .from("posts")
                        .select(`post_content,
                        post_created,
                        post_updated,
                        post_id,
                        user_key,
                        users(
                            user_name,
                            user_id
                        )
                            `)
                        .order("post_created", { ascending: false });
            if(postID){
                query = query.eq("post_id", postID);
            } else if (userKey) {
                query = query.eq("user_key", userKey);
            }
            const { data } = await query;
            return data;
        }
        catch (err) {
            console.log(err);
        }
    }

    async fetchComment(postID) {
        try {
            const { data } = await this.supabase
                .from("comments")
                .select(`
                comm_id,
                comm_content,
                comm_created,
                comm_updated,
                user_key,
                users(
                    user_name
                ),
                comm_parentid
                `)
                .eq("post_id", postID)
                .order("comm_created", { ascending: false })
            return data;
        }
        catch (err) {
            console.log(err);
        }
    }

    async insertComment(content, userKey, postID, commParentid) {
        try {
            let query = this.supabase.from("comments")
            if (content && userKey && postID && commParentid) {
                query = await query.insert([{ comm_content: content, user_key: userKey, post_id: postID, comm_parentid: commParentid }])
            } else if (content && userKey && postID) {
                query = await query.insert([{ comm_content: content, user_key: userKey, post_id: postID }])
            };

            const { data } = query;
        }
        catch (err) {
            console.log(err);
        }
    }
}