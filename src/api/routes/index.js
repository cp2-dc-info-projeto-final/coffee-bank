var express = require('express');
var router = express.Router();

/* GET do index - teste da API */
router.get('/', function(req, res, next) {
 return res.status(200).json({
        success: true,
        message: 'Eba, agora nós podemos te encher de muitos jutros abusivos e que provavelmente nos levariam presos'
      });
});

module.exports = router;
