# Personal Budget 1
## Portfolioproject from Back End Engineer Path on Codecademy

Completed 2022-10-09

Set up envelopes with categories and balances and add expenses in order to budget your daily spendings.

### Routes

GET    .../api/envelopes/ - Gets all envelopes.

POST   .../api/envelopes/transfer/:from/:to - Post amount to transfer from one envelope to another (by id).

GET    .../api/envelopes/:envelopeId - Get specific envelope.

PUT    .../api/envelopes/:envelopeId - Update specific envelope by supplying expense.

POST   .../api/envelopes/:envelopeId - Set new balance for specific envelope.

GET    .../api/envelopes/:envelopeId/:expenseAmount - Withdraw expense from specific envelope.

DELETE .../api/envelope/:envelopeId - Delete specific envelope.


User cannot withdraw a greater expense than the balance of a specific envelope balance.
