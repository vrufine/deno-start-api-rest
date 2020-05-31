interface IUser {
  id: number,
  name: string
  email: string
  createdAt: number
  updatedAt: number
}

let users: IUser[] = [
  {
    id: 1,
    name: 'João',
    email: 'joao@gmail.com',
    createdAt: 0,
    updatedAt: 0
  },
  {
    id: 2,
    name: 'Maria',
    email: 'Maria@gmail.com',
    createdAt: 1,
    updatedAt: 1
  }
]

const getUsers = ({ response }: { response: any }) => {
  response.body = users
}

const getUser = ({ params, response }: { params: { id: any }, response: any }) => {
  if (!params.id) {
    response.body = {}
    return
  }
  
  const userFound: IUser | undefined = findUserByParamsId(params)

  response.status = userFound ? 200 : 404
  response.body = userFound || { message: `User ${params.id} not found` }
}

const addUser = async (
  { request, response }: { request: any, response: any }
) => {
  const parsedBody = await request.body()
  const newUser: IUser = parsedBody.value
  const timestamp = new Date().getTime()
  
  newUser.id = users.length + 1
  newUser.createdAt = timestamp
  newUser.updatedAt = timestamp
  users.push(newUser)

  response.body = { message: 'User successfully created!' }
  response.status = 201
}

const updateUser = async (
  { request, response, params }: {
    request: any,
    response: any,
    params: {
      id: any
    }
  }
) => {
  if (!params.id) {
    response.body = { message: 'You need to send the user ID to update!' }
    response.status = 400
    return
  }
  const indexUser = users.findIndex(u => u.id.toString() === params.id.toString())
  if (indexUser === -1) {
    response.status = 404
    response.body = { message: `User with ID ${params.id} not found!` }
    return
  }
  let userFound: IUser = users[indexUser]

  const parsedBody = await request.body()
  const newInfos: { name?: string, email?: string } = parsedBody.value
  const updatedUser: IUser = {
    ...userFound,
    ...newInfos,
    updatedAt: new Date().getTime()
  }
  
  console.log('users[indexUser]', users[indexUser])
  users[indexUser] = updatedUser
  console.log('users[indexUser]', users[indexUser])

  response.status = 200
  response.body = { message: 'User successfully updated!' }
}

const deleteUser = ({ params, response }: { response: any, params: { id: any }}) => {
  if (!params.id) {
    response.status = 400
    response.body = { message: 'You need send the user ID to be deleted!' }
    return
  }

  const userIndex = users.findIndex(u => u.id.toString() === params.id.toString())
  if (userIndex === -1) {
    response.status = 404
    response.body = { message: 'Not found' }
    return
  }

  users = users.filter(u => u.id.toString() !== params.id.toString())
  
  response.status = 200
  response.body = { message: 'User successfully deleted!' }
}

export { getUsers, getUser, addUser, updateUser, deleteUser }

function findUserByParamsId(params: { id: any }): IUser | undefined {
  params.id = Number(params.id)
  return users.find(user => user.id === params.id)
}
