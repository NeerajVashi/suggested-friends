import express from 'express';
import fetch from 'node-fetch';
import sqlQuery from '../config/query';


const router = express.Router();


router.get('/:id', async (req, res) => {
  console.log('inside');
  const friendId = req.params.id;
  const loginRequest = `http://localhost:8000/user/${friendId}`;
  await fetch(loginRequest).then(response => response.json())
    .then(async (users) => {
      const newFriend = await sqlQuery.addFriend(users, friendId);
      res.status(200).json(newFriend);
    });
});

router.post('/add/:id', async (req, res) => {
  const friendId = req.params.id;
  const user = req.body;
  const newFriend = await sqlQuery.add(user, friendId);
  res.status(200).json(newFriend);
});

router.get('/display/:id', async (req, res) => {
  const friendId = req.params.id;
  const [newFriend] = await sqlQuery.display(friendId);
  res.status(200).json(newFriend);
});

router.put('/update/:id', async (req, res) => {
  console.log('inside update');
  const friendId = req.params.id;
  const response = req.body;
  console.log('friendId', friendId, 'response', response);
  const [newFriend] = await sqlQuery.updateFriendList(friendId, response);
  const requestBody = {
    status: response.status,
    senderFirstName: response.senderFirstName,
    senderSurName: response.senderSurName,
    receiverFirstName: response.firstName,
    receiverSurName: response.surName,
    senderId: response.senderId,
    senderImage: response.senderImage,
    receiverImage: response.receiverImage,
  };
  console.log('requestBody', requestBody);
  if (response.status === 'sent') {
    const loginRequest = `http://localhost:8003/request/add/${friendId}`;
    fetch(loginRequest, {
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json',
      },
      method: 'post',
      body: JSON.stringify(requestBody),
    })
      .then(response => response.json())
      .then((user) => {
        console.log('user', user);
        console.log('update', newFriend);
        res.status(200).json(newFriend);
      });
  }
  console.log('update', newFriend);
  res.status(200).json(newFriend);
});

router.delete('/delete/:id', async (req, res) => {
  const friendId = req.params.id;
  const userId = req.body;
  const [newFriend] = await sqlQuery.deleteFriendList(friendId, userId);
  res.status(200).json(newFriend);
});

module.exports = router;
