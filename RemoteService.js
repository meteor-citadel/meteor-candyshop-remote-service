module.exports = class RemoteService {

	constructor(connection, collections = []) {
		this.connection = connection
		this.collections = collections.reduce(
			(acc, cur) => {
				acc[cur] = new Mongo.Collection(cur, { connection })
				return acc
			}, {}
		)
	}

	call(...args) {
		return new Promise((resolve, reject) => {
			const method = args.shift()
			this.connection.apply(method, args, (err, res) => {
				err ? reject(err) : resolve(res)
			})
		})
	}

	async login(credentials) {
		const user = await this.call('usersLogin', credentials)
		this.connection.setUserId(user._user)
		return user
	}

	subscribe(...args) {
		return this.connection.subscribe(...args)
	}

	getUserId() {
		return this.connection.userId()
	}

}

