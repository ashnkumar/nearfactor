<br />
**Contract address on NEAR TestNet:**
[Hc197WriGYnXR1eg6xjq94UCSfkMRtmUXkckshcvPnh6](https://explorer.testnet.near.org/transactions/Hc197WriGYnXR1eg6xjq94UCSfkMRtmUXkckshcvPnh6)

## Near Factor: DeFi protocol for receivables-based financing
Near Factor is a general-purpose factroing protocol built to facilitate receivables-based lending. [Factoring](https://www.wikiwand.com/en/Factoring_(finance)) is one of oldest tools in the commercial finance world, but so far has been limited to centralized institutions which only cater to industries that they've traditionally been able to finance. **Near's low cost and high scalability make it the perfect protocol to build a receivables-based financing paradigm on top of.**

<br />

## The Problem: The benefits of factoring are limited to few players in finance
Factoring is a very mature commercial lending paradigm that has been solving for critical working capital gaps in numerous industries, most notably in trucking, construction, and supply-chain financing. 
![Alt Text](https://i.imgur.com/8kx880v.png)
Factoring is a mechanism in which a payee (i.e. a truck driver) is given an accounts receivable -- usually a type of invoice -- from a company that's hired them for work (i.e. large grocery chains that need goods moved across the state). These invoices may have a net-30 payment term, meaning the truck driver won't get paid for their work until 30-60 days after they finish the job. Working capital is tight in trucking, so many truck drivers opt to sell their receivable to a factoring company that will provide them cash upfront, minus a fee. The factoring company now owns the receivable and is paid by the original payor company in the usual net 30 day terms.

**The problem with factoring today**
As beneficial as the merchant cash advance service can be, it's extremely limited to the industries that factoring companies feel comfortable underwriting in, which are few and far in-between. The move towards digital commerce has opened up the world to millions of other people that have receivables-based work -- authors and advances, gig workers, social media influencers with incoming brand payments, and more. Additionally, the yield for *investors* is also limited to the factoring companies themselves - factoring is not yet at the place where anyone can invest and benefit from this asset class. 
<br />

## Solution: DeFi factoring protocol built on Near (general-purpose)
To solve for both pain points -- helping more people get access to factored funds, and opening up access to factoring to more investors -- we built Near Factor, a smart contract built on Near that facilitates **decentralized factoring** for various paradigms. For the hackathon, Near Factor uses a single example of invoice-based factoring, but we've made it modular enough that it can be reused and modified for *any* receivables-based financing protocol. It makes sense that this would be built first on Near (at scale) given the velocity of receivables and pay-ins and payouts that need to take place to create such a protocol.

 <br />

### 1️⃣ Criteria: _Design of the experience_
Near Factor is made for ease of use among all its stakeholders: payees (those selling receivables for upfront cash), investors (those wanting to earn a new type of yield divorced from traditional lending), and payors (those needing to pay back invoices in a seamless way).

![Alt Text](https://i.imgur.com/Id5V1ZB.png)

**How easy is it for end-users?**
Though the protocol is complicated on the backend, it's designed to be *extremely* simple for folks involved. Here are the steps in how the protocol is structured for our smart contract:
1. **Investors** can buy shares from the contract to have a stake in the profits. Just like traditional factoring, they can choose "tranches" to invest in based on their risk appetite: high-risk, medium-risk, and low-risk. Risk is based on the likelihood that the payee will complete the work required for the payor to pay the receivable, and probability that the payor will deliver.
2. **Payees** easily submit their receivable to the smart contract by providing the amount of the contract, payor account, and uploading an image of the invoice (or other receivable) itself, which is stored on IPFS for anyone to audit.
3. **Underwriting** happens on the contract side. We built an algorithm for the invoice-based factoring use case in the hackathon, but the Near Factor protocol is modular and developers can swap in whatever algorithm makes sense for their use case. Once the contract underwrites the payee, it automatically pays out NEAR to the payee, minus a discount. The size of this discount is based on the risk level of the payee: higher risk means higher discount.
4. **Payor pays back receivable** easily by swapping in the account they'd pay to from the payee to the contract's address. In cases where the payors aren't savvy with smart contracts, our dApp makes it very easy for them to pay directly from the web.
5. **Profits are distributed** to the investors holding that risk-level of shares as soon as each invoice is paid back. This is similar to a dividend in traditional finances.
6. **Payee and payor increase their 'credit score'** given proof that they've been able to pay back the funds. Next time, they'll qualify for a smaller discount!

<br />

### 2️⃣ Criteria: _Technical implementation_
In the video above, We cover the technical overview in detail, along with a demo to show how all parties can interact with the real smart contract, live on Testnet.
![Alt Text](https://i.imgur.com/qWGwvsf.gif)

| Component | Description |
| ------ | ------ |
| **Contract structure** | NEAR's SDKs and APIs were incredibly easy to use. Near Factor leverages the **[create-near-app](https://github.com/near/create-near-app)** module to build the skeleton of the contract, which includes a frontend to interact with the contract (in React) and the contract code in Typescript.
| **Contract state (data structures)** | Near Factor uses a combination of Javascript native data structures along with Near JS SDK **[collections](https://docs.near.org/develop/contracts/storage)** to keep track of contract state, including: **[Vectors](https://docs.near.org/develop/contracts/storage#vector)** to track the list of share transactions and a host of **[UnorderedMaps](https://docs.near.org/develop/contracts/storage#map)** to track invoice receivables & status, investors in the contract, and more.
| **Near JS Decorators** | Near factor makes use of almost _all_ the NEAR **[contract interface decorators](https://docs.near.org/develop/contracts/anatomy#interface)** like @view, @call, @initialize, @payables and more to build out its capabilities.
| **Near Fungible Tokens (coming in Q4'22)** | The current prototype contract tracks the invoice + investors' state within UnorderedMaps in the contract, but it will leverage **[NEAR Fungible Tokens](https://docs.near.org/develop/relevant-contracts/ft)** within the next 2 weeks to issue FT's to investors based on risk level (i.e. NFH for 'higher risk' shares, NFM for 'medium risk' shares, and NFL for 'lower-risk' shares). This opens up a whole new world of DeFi since investors can sell their Near Factor FT's to other (or even package them up together to create brand new financial instruments!). The contract will pay out profits to whoever holds the tokens, which will create a true Near Factor share marketplace for downstream trading.

<br />

### 3️⃣ and 4️⃣ Criteria: _Originality & Impact: this is broadly applicable across NEAR_
The point of this project isn't to keep it for one single use case. Factoring and receivable-based financing is extremely nuanced based on the industry it operates in and how the mechanisms work per use case:
* **Social media influencers** often have brands paying them on net-30 terms; with that money upfront, they can invest in more equipment to grow their customer base quickly.
* **Authors and writers** often are given some advance to finish their work, with the rest delivered 30-60 days after delivery of the final product. They could also use this protocol to borrow against those future earnings.
* **Shift workers** including the hospitality industry often are given their pay weeks out from the completion of their work, which serves yet another use case.

We made the contract modularized in a few ways:
1. **Underwriting algorithm**: we used one for the invoice-based factoring use case but we wanted to make it modular so any developer can clone our contract and swap in a more nuanced underwriting algorithm based on the data they have for their use case.
2. **Tranches of risk**: We built the contract so that other developers can issue their own fungible tokens in whatever risk tranches makes sense for them, including mixing and matching.
2. **Payor experience**: Our contract simply gives an address to the payor to pay the funds, but given advances in dApps, we think many developers can come up with even easier ways to let the payors pay back a receivable.

<br />
### 5️⃣ Criteria:  _Project sustainability_
We're using the NEAR Metabuild hackathon as the kicking-off point for NearFactor. The prototype contract we made for the hackathon is v1 - we have a plan of issues to tackle to make this an even more robust, extensible contract over the next few months.

| Component | Ship Date | Description |
| ------ | ------ | ------ |
| **Fungible token issuance** | Q4'22 | The contract currently tracks an internal ledger of investors' shares in the protocol. This was the fastest way to get the prototype of the protocol up and running, but the next step is issuing fungible tokens instead when someone invests in the contract at each risk level. That way, token holders (shareholders in the protocol) can **trade their shares/tokens with others**, and the profits from each successfuly paid back receivable will automatically route to whoever is holding the token, similar to buying stock shares and receiving dividends.
| **Underwriting improvements through oracles** | Q4'22 - Q1'23 | The contract currently relies on the veracity of inputted information from the payee when uploading a receivable for outbound payment. To automate this and prevent fraud, a major next step is building out the underwriting capabilities by including additional data about each receivable. The first step is using OCR on an uploaded image / PDF of an invoice -- verified by the signing of the payor -- which will automatically extract the relevant details for each invoice and store it in the contract. In addition to OCR, there are numerous other improvements we're making around the sophistication of the 'credit score' like taking into account both the payee's repayment rate and the **_payor's_** track record of delivering on oustanding invoices within the net 30-60 day window.
| **Milestone-based financing** | Q1'23 | The contract currently only lets the payor pay the receivable in full. In reality, many invoices have a milestone-based element: when step 1 of the job is finished, pay out X, then when step 2 of the job is finished, pay out Y, etc. We're building the flexibility for these complex receivables-based financing schemes so we can support more interesting use cases.
| **Distribution through commercial partnerships** | Q1'23 | To bootstrap the TVL in the contract and get it launched, we're starting to explore which partners to market the capabilities to. There are many forward-thinking investors and industries that would want to adopt this contract quickly, those with receivables-based financing being a 'hair on fire' problem. Our initial potential partners include: supply-chain financing firms, online 'gig worker' Fiverr and Upwork, and more.
