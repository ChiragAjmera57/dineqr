const { joinExistingTable, joinNewTable } = require('../../middleware/validateSession.middleware');

const router = require('express').Router();

router.post('/join-exist-table', (req, res) => {
  joinExistingTable(req, res);
});

router.post('/create-new-table', (req, res) => {
  joinNewTable(req, res);
});

module.exports = router;