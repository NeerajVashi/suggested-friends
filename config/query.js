// import fetch from 'node-fetch';
import pool from './sqlPool';


async function addFriend(users, Id) {
  try {
    console.log('deleting');
    await pool.execute('truncate table friends');
    console.log('deleted');
    const text = 'Add Friend';
    await users.map(async (user, id) => {
      await pool.execute('insert into friends(userId, friendId, firstName, surname, status , Profile_pic) values(?,?,?,?,?,?)', [Id, user.id, user.firstName, user.surName, text, user.Profile_pic]);
    });
    return { status: true, msg: 'friend successfully inserted' };
  } catch (err) {
    console.log('err');
    return ('err');
  }
}

async function add(user, Id) {
  console.log('users', user, 'Id', Id);
  const text = 'Add Friend';
  await pool.execute('insert into friends(userId, friendId, firstName, surname, status) values(?,?,?,?,?)', [Id, user.id, user.firstName, user.surName, text]);
  return { status: true, msg: 'friend successfully inserted' };
}

async function display(Id) {
  const friends = await pool.execute('select * from friends where userId = ?', [Id]);
  return friends;
}

async function updateFriendList(friendId, request) {
  console.log('userId', friendId, 'request', request);
  await pool.execute('update friends set status = ? where userId = ? and friendId = ?', [request.status, request.senderId, friendId]);
  const friends = await pool.execute('select * from friends where userId = ?', [request.senderId]);
  return friends;
}

async function deleteFriendList(friendId, userId) {
  await pool.execute('delete from friends where userId = ? and friendId = ?', [userId.userId, friendId]);
  const friends = await pool.execute('select * from friends where userId = ?', [userId.userId]);
  return friends;
}

module.exports = {
  addFriend,
  add,
  display,
  updateFriendList,
  deleteFriendList,
};
