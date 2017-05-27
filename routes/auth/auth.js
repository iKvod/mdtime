/**
 * Created by rafa on 18/05/2017.
 */

passport.use(new OpenIDStrategy({
    returnURL: 'http://localhost:8888/auth/openid/return',
    realm: 'http://localhost:8888/'
  },
  function(identifier, done) {
    User.findByOpenID({ openId: identifier }, function (err, user) {
      return done(err, user);
    });
  }
));

app.post('/auth/openid',
  passport.authenticate('openid'));

app.get('/auth/openid/return',
  passport.authenticate('openid', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });
strategy.saveAssociation(function(handle, provider, algorithm, secret, expiresIn, done) {
  saveAssoc(handle, provider, algorithm, secret, expiresIn, function(err) {
    if (err) { return done(err) }
    return done();
  });
});

strategy.loadAssociation(function(handle, done) {
  loadAssoc(handle, function(err, provider, algorithm, secret) {
    if (err) { return done(err) }
    return done(null, provider, algorithm, secret)
  });
});