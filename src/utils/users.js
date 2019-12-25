const users = []

const addUser = ({ id, username, roomname }) => {

    username = username.trim().toLowerCase()
    roomname = roomname.trim().toLowerCase()

    if (!username || !roomname) {
        return {
            error: "Fields are required"
        }
    }

    const exsitingUser = users.find((user) => {

        return user.roomname === roomname && user.username === username
    })

    if (exsitingUser) {
        return {
            error: "User Name already taken"
        }
    }

    const user = { id, username, roomname }
    users.push(user)
    return { user }
}

const removeUser = (id) => {

    const Index = users.findIndex((user) => {

        return user.id === id
    })

    if (Index > -1) {
        return users.splice(Index, 1)[0]
    }
    else {
        return {
            error: 'User was not found'
        }
    }
}

const getUser = (id) => {


    const userFound = users.find((user) => {
        return user.id === id
    })

    if (userFound) {
        return userFound
    }


}

const getUsersInRoom = (roomname) => {

    const usersInRoom = users.filter((user) => {

        return user.roomname === roomname
    })

    if (usersInRoom) {
        return usersInRoom
    }

    else {
        return []
    }
}

module.exports={
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}
