var IN_CI = !!process.env.TDDIUM;
process.env.KARMA = true;

module.exports = { IN_CI: IN_CI };
