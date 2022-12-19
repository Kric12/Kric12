import * as BLL from './api/auth/auth.bll.js';
import * as Repository from './api/users/users.repository.js';
import sha256 from 'b-crypto/sha256.js';

const userObj = {
	_id: "id",
	username: "user",
	email: "email",
	password: "HASHED PASSWORD",
	role: "role"
}

jest
	.mock('./api/users/users.repository.js', () => ({
		getUserByEmail: () => userObj, // OPCION 1
		getUserByUsername: () => userObj
	}))
	.mock('b-crypto/sha256.js', () => () => "HASHED PASSWORD")

const getUserByEmail = Repository.getUserByEmail; // OPCION 2
const getUserByUsername = Repository.getUserByUsername;

describe("AUTHENTICATION TESTING", async () => {
  test("LOGIN (with email)", () => {
		getUserByEmail.mockResolvedValue(userObj);
		getToken.mockReturnValue({token: "HASHED TOKEN"});

		const result = BLL.login(true, {id: "email", password: "RAW PASSWORD"});

		expect(sha256.toHaveBeenCalledTimes(1));
		expect(sha256.toHaveBeenCalledWith("RAW PASSWORD"));

		expect(getUserByEmail.toHaveBeenCalledTimes(1));
		expect(getUserByEmail.toHaveBeenCalledWith({email: userObj.email}));

		expect(getToken.toHaveBeenCalledTimes(1));
		expect(getToken.toHaveBeenCalledWith({user: userObj._id, role: userObj.role}));

		expect(result.token).toBe("HASHED TOKEN");
	})

	test("LOGIN (with username)", () => {
		const userObj = {
			_id: "id",
			username: "user",
			email: "email",
			password: "HASHED PASSWORD",
			role: "role"
		}
		const tokenObj = {
			token: "HASHED TOKEN"
		}

		sha256.mockReturnValue("HASHED PASSWORD");
		getUserByUsername.mockResolvedValue(userObj);
		getToken.mockReturnValue(tokenObj);

		const result = BLL.login(true, {id: "email", password: "RAW PASSWORD"});

		expect(sha256.toHaveBeenCalledTimes(1));
		expect(sha256.toHaveBeenCalledWith("RAW PASSWORD"));

		expect(getUserByEmail.toHaveBeenCalledTimes(1));
		expect(getUserByEmail.toHaveBeenCalledWith({email: userObj.email}));

		expect(getToken.toHaveBeenCalledTimes(1));
		expect(getToken.toHaveBeenCalledWith({user: userObj._id, role: userObj.role}));

		expect(result.token).toBe("HASHED TOKEN");
	})

})

