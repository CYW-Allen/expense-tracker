module.exports = (req, res, next) => {
	if (req.isAuthenticated()) return next();
	req.flash('fail', '尚未登入');
	res.redirect('/login');
}