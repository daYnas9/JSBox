// Below given code demonstrates how transactions work in mongoDB.

accountRouter.post('/transfer', authenticateToken, async (req, res) => {
    try {
        const session = await mongoose.startSession(); // starting session 
        session.startTransaction(); // starting transaction

        const { to, amount } = req.body;
        const payeeId = req.userId;

        const payee = await User.findOne({ userId: payeeId }).session(session);
        const beneficiary = await User.findOne({ userId: to }).session(session);
        if(!beneficiary || !payee) {
            await session.abortTransaction(); // aborting transaction
            res.status(400).json({ message: 'Invalid account' });
        }
        
        const payeeAccount = await Account.findOne({ userId: payeeId }).session(session);
        const beneficiaryAccount = await Account.findOne({ userId: beneficiary.userId }).session(session);
        
        const currentBalance = payeeAccount.balance;
        if(currentBalance < amount) {
            session.abortTransaction();
            res.status(400).json({ message: 'Insufficient balance'});
        }
        await payeeAccount.updateOne({ userId: payeeId }, { $inc: { balance: -amount } });
        await beneficiaryAccount.updateOne({ userId: payeeId }, { $inc: { balance: amount } });
        await session.commitTransaction(); // end successful transaction
         
        res.status(200).json({ message: 'Transfer successful' })
    } catch(e) {
        session.abortTransaction();
        res.status(400).json({ error: 'Transfer failed.' })
    }
})
