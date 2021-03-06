const actionUtil = require('sails/lib/hooks/blueprints/actionUtil');
const ipaddr = require('ipaddr.js');
const _ = require('lodash');

module.exports = (req, res, next) => {
	//TBD: Client with KONG!
	var ip = req.headers['x-forwarded-for'] ? req.headers['x-forwarded-for'] : req.connection.remoteAddress
		// automatically parse and converts to ipv4

	// Fix if network sends two ips
	ip = _.indexOf(ip, ',') !== -1 ? ip.split(',')[0] : ip;

	var addr = ipaddr.process(ip);
	try {
		resource = _.capitalize(actionUtil.parseModel(req).identity);
	} catch (err) {
		resource = null;
	}
	var data = {
		ip: addr.toString(),
		method: req.method,
		useragent: req.headers['user-agent'],
		resource: resource,
		querystring: (_.isEmpty(req.query)) ? null : JSON.stringify(req.query),
		endpoint: req.path
	};
	Statistic.create(data).exec(function created(err) {
		if (err) {
			return res.negotiate(err);
		}
	});

	next();
};