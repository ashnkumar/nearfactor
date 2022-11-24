# Near Factor: DeFi protocol for receivables-based financing
Near Factor is a general-purpose factroing protocol built to facilitate receivables-based lending. [Factoring](https://www.wikiwand.com/en/Factoring_(finance)) is one of oldest tools in the commercial finance world, but so far has been limited to centralized institutions which only cater to industries that they've traditionally been able to finance. **Near's low cost and high scalability make it the perfect protocol to build a receivables-based financing paradigm on top of.**

# The Problem: The benefits of factoring are limited to few players in finance
Factoring is a very mature commercial lending paradigm that has been solving for critical working capital gaps in numerous industries, most notably in trucking, construction, and supply-chain financing. 
![Alt Text](https://i.imgur.com/8kx880v.png)
Factoring is a mechanism in which a payee (i.e. a truck driver) is given an accounts receivable -- usually a type of invoice -- from a company that's hired them for work (i.e. large grocery chains that need goods moved across the state). These invoices may have a net-30 payment term, meaning the truck driver won't get paid for their work until 30-60 days after they finish the job. Working capital is tight in trucking, so many truck drivers opt to sell their receivable to a factoring company that will provide them cash upfront, minus a fee. The factoring company now owns the receivable and is paid by the original payor company in the usual net 30 day terms.

**The problem with factoring today**
As beneficial as the merchant cash advance service can be, it's extremely limited to the industries that factoring companies feel comfortable underwriting in, which are few and far in-between. The move towards digital commerce has opened up the world to millions of other people that have receivables-based work -- authors and advances, gig workers, social media influencers with incoming brand payments, and more. Additionally, the yield for *investors* is also limited to the factoring companies themselves - factoring is not yet at the place where anyone can invest and benefit from this asset class. 

# Solution: DeFi factoring protocol built on Near (general-purpose)
To solve for both pain points -- helping more people get access to factored funds, and opening up access to factoring to more investors -- we built Near Factor, a smart contract built on Near that facilitates **decentralized factoring** for various paradigms. For the hackathon, Near Factor uses a single example of invoice-based factoring, but we've made it modular enough that it can be reused and modified for *any* receivables-based financing protocol. It makes sense that this would be built first on Near (at scale) given the velocity of receivables and pay-ins and payouts that need to take place to create such a protocol.
 
### Design of the experience
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

### Technical implementation
In the video above, We cover the technical overview in detail, along with a demo to show how all parties can interact with the real smart contract, live on Testnet.

### Impact: this is broadly applicable across NEAR
The point of this project isn't to keep it for one single use case. Factoring and receivable-based financing is extremely nuanced based on the industry it operates in and how the mechanisms work per use case:
* **Social media influencers** often have brands paying them on net-30 terms; with that money upfront, they can invest in more equipment to grow their customer base quickly.
* **Authors and writers** often are given some advance to finish their work, with the rest delivered 30-60 days after delivery of the final product. They could also use this protocol to borrow against those future earnings.
* **Shift workers** including the hospitality industry often are given their pay weeks out from the completion of their work, which serves yet another use case.

We made the contract modularized in a few ways:
1. **Underwriting algorithm**: we used one for the invoice-based factoring use case but we wanted to make it modular so any developer can clone our contract and swap in a more nuanced underwriting algorithm based on the data they have for their use case.
2. **Tranches of risk**: We built the contract so that other developers can issue their own fungible tokens in whatever risk tranches makes sense for them, including mixing and matching.
2. **Payor experience**: Our contract simply gives an address to the payor to pay the funds, but given advances in dApps, we think many developers can come up with even easier ways to let the payors pay back a receivable.


### Project sustainability
We already have a plan of issues to tackle to make this an even more robust, extensible contract:
1. Issuing FTs directly to investors so they can trade their shares in the contract, similar to trading traditional debt.
2. Using oracles to better underwrite payees - we use invoice images for now but can imagine much more data to be useful.
3. Milestone-based financing: instead of waiting for the entire invoice to be paid at once, we can use milestone financing to pay back in chunks.