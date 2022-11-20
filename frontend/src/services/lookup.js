import axios from 'axios'

async function lookUp (payload){
    const result = await axios.post('http://localhost:5001/lookup',payload)

    return result.data.data
}

export async function lookUpFriend (userId) {
    const payload = {
        userId,
        entity : 'friend'
    }

    const result = await lookUp(payload)
    return result
}

export async function lookUpUsers (userId){
    const payload ={
        userId,
        entity : 'list-user'
    }

    const result = await lookUp(payload)
    return result
}