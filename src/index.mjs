import express from "express";

const app = express();

app.use(express.json())

const resolveIndexByUserId = (req, res, next) => {
    const { body, params: { id }} = req
    const parsedId = parseInt(id)

    if(isNaN(parsedId)) {
        return res.sendStatus(400)
    }

    const findUserIndex = mockUsers.findIndex(user => {
        return user.id === parsedId
    })

    if(findUserIndex === -1) return res.sendStatus(404)
    req.findUserIndex = findUserIndex;
    next()
}

const PORT = process.env.PORT || 3000;

const mockUsers = [
    { id: 1, username: "anson", displayName: "Anson" },
    { id: 2, username: "deborah", displayName: "Deborah" },
    { id: 3, username: "robot", displayName: "Robot" },
  ]

app.get("/", (req, res) => {
  res.status(201).send({ msg: "hello" });
});

app.get("/api/users", (req, res) => {
    const { query: { filter, value}} = req;

    if(filter && value) return res.send(mockUsers.filter(user => {
        return user[filter].includes(value);
    }))
    
    return res.send(mockUsers);
});

app.post('/api/users', (req,res) => {
    const { body } = req
    const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...body}
    mockUsers.push(newUser)
    res.status(201).send(newUser)
})

app.get("/api/users/:id", (req, res) => {
    const parsedId = parseInt(req.params.id);
    if(isNaN(parsedId)) {
        return res.status(400).send({ msg: "Bad Request, Invalid ID."})
    }

    const requestedUser = mockUsers.find(user => user.id == parsedId)
    
    if(!requestedUser) return res.sendStatus(404)

    res.send(requestedUser)
})

app.get('/api/products', (req, res) => {
    res.send([
        {id: 1, name: "Chicken Breast", price: 12.99},
        {id: 2, name: "Frozen Wings", price: 14.99},
        {id: 3, name: "Doughnut", price: 6.99},
    ])
})

app.put('/api/users/:id', resolveIndexByUserId , (req, res) => {
    const { body, findUserIndex} = req

    mockUsers[findUserIndex] = {
        id: mockUsers[findUserIndex].id , ...body
    }
    return res.sendStatus(200);
})

app.patch('/api/users/:id', resolveIndexByUserId , (req, res) => {
    const { body, findUserIndex} = req

    mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body}
    return res.sendStatus(200)
})

app.delete('/api/users/:id', (req, res) => {
    const { params: {id}} = req;
    const parsedId = parseInt(id);
    if(isNaN(parsedId)) return res.sendStatus(400)

    const findUserIndex = mockUsers.findIndex(user => user.id === parsedId);
    if(findUserIndex === -1) return res.sendStatus(404);

    mockUsers.splice(findUserIndex, 1)
    return res.sendStatus(200)
})

app.listen(PORT, () => {
  console.log(`Running on Port ${PORT}`);
});
