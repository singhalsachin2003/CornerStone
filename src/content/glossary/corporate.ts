/** Corporate issuers: capital structure, cost of capital and governance. */
import { GlossaryTerm } from './types';

export const CORPORATE_TERMS: GlossaryTerm[] = [
  {
    key: 'wacc',
    term: 'Weighted average cost of capital',
    aka: ['WACC'],
    definition:
      'The blended required return on a company’s capital, weighting each source by its share of the total at market value.',
    formula: 'WACC = w_d × r_d × (1 − t) + w_e × r_e',
    note: 'Use market weights and target weights, not book values. The tax shield applies to debt only, which is why debt looks cheap before considering the distress it brings.',
    topics: ['cfa-l1-corp', 'cfa-l2-corp', 'cfa-l1-equity'],
  },
  {
    key: 'cost-of-equity',
    term: 'Cost of equity',
    definition: 'The return equity holders require for bearing the residual risk of the business.',
    note: 'Usually estimated with CAPM, sometimes with a dividend discount rearrangement or a build-up model for private firms. All three are estimates, and they rarely agree.',
    topics: ['cfa-l1-corp', 'cfa-l1-equity'],
  },
  {
    key: 'capital-structure',
    term: 'Capital structure',
    definition: 'The mix of debt and equity a company uses to fund itself.',
    note: 'Modigliani–Miller says the mix is irrelevant without taxes, distress costs or information asymmetry. Everything interesting comes from relaxing those assumptions.',
    topics: ['cfa-l1-corp', 'cfa-l2-corp'],
  },
  {
    key: 'pecking-order-theory',
    term: 'Pecking order theory',
    definition:
      'The observation that firms prefer internal funds first, then debt, and issue equity last.',
    note: 'Driven by information asymmetry: issuing equity signals that management thinks the shares are expensive, so the announcement itself moves the price.',
    topics: ['cfa-l1-corp', 'cfa-l2-corp'],
  },
  {
    key: 'agency-problem',
    term: 'Agency problem',
    definition:
      'The conflict that arises when managers act in their own interest rather than that of the owners who employ them.',
    note: 'Also runs between shareholders and bondholders — asset substitution after a leveraged deal is the classic case.',
    topics: ['cfa-l1-corp', 'cfa-l2-corp', 'frm-p1-foundations'],
  },
  {
    key: 'corporate-governance',
    term: 'Corporate governance',
    definition:
      'The system of controls by which a company is directed and held accountable to its stakeholders.',
    topics: ['cfa-l1-corp', 'cfa-l2-corp'],
  },
  {
    key: 'stakeholder',
    term: 'Stakeholder',
    definition:
      'Any party with an interest in the company — shareholders, creditors, employees, customers, suppliers, regulators and the wider community.',
    topics: ['cfa-l1-corp'],
  },
  {
    key: 'capital-budgeting',
    term: 'Capital budgeting',
    definition: 'The process of deciding which long-term investments a company should make.',
    note: 'Use incremental after-tax cash flows. Sunk costs are excluded; opportunity costs and externalities are included.',
    topics: ['cfa-l1-corp'],
  },
  {
    key: 'sunk-cost',
    term: 'Sunk cost',
    definition:
      'A cost already incurred and unrecoverable, and therefore irrelevant to any decision now.',
    topics: ['cfa-l1-corp'],
  },
  {
    key: 'opportunity-cost',
    term: 'Opportunity cost',
    definition: 'The value of the best alternative given up by choosing one course of action.',
    topics: ['cfa-l1-corp', 'cfa-l1-econ'],
  },
  {
    key: 'dividend-policy',
    term: 'Dividend policy',
    definition: 'How a company decides to return cash to shareholders, and in what form.',
    note: 'A cut is read as a signal about future earnings, which is why firms smooth dividends and prefer buybacks for variable returns of capital.',
    topics: ['cfa-l1-corp', 'cfa-l2-corp'],
  },
  {
    key: 'share-buyback',
    term: 'Share repurchase',
    aka: ['buyback'],
    definition: 'A company buying its own shares, reducing the share count.',
    note: 'Equivalent to a dividend in cash terms but more flexible and often tax-advantaged. Raises EPS mechanically, which is not the same as creating value.',
    topics: ['cfa-l1-corp'],
  },
  {
    key: 'working-capital-management',
    term: 'Working capital management',
    definition:
      'Managing receivables, payables, inventory and cash so the business has liquidity without tying up more capital than it needs.',
    topics: ['cfa-l1-corp'],
  },
  {
    key: 'cash-conversion-cycle',
    term: 'Cash conversion cycle',
    definition: 'The time between paying for inventory and collecting cash from the customer.',
    formula: 'CCC = Days inventory + Days receivable − Days payable',
    note: 'A negative cycle means suppliers fund the business. Retailers and marketplaces often run one.',
    topics: ['cfa-l1-corp', 'cfa-l1-fsa'],
  },
  {
    key: 'business-risk',
    term: 'Business risk',
    definition:
      'The uncertainty in operating income arising from the nature of the business itself, before any financing decision.',
    note: 'Financial risk is what leverage adds on top. Keeping the two separate is the point of the distinction.',
    topics: ['cfa-l1-corp', 'frm-p1-foundations'],
  },
];
