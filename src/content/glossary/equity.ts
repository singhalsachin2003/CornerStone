/** Equity investments: markets, indices and valuation. */
import { GlossaryTerm } from './types';

export const EQUITY_TERMS: GlossaryTerm[] = [
  {
    key: 'common-share',
    term: 'Common share',
    aka: ['ordinary share', 'common stock'],
    definition:
      'An ownership claim on a company’s residual cash flows and assets, normally carrying a vote and ranking last in liquidation.',
    topics: ['cfa-l1-equity'],
  },
  {
    key: 'preferred-share',
    term: 'Preference share',
    aka: ['preferred stock'],
    definition:
      'A share with a stated dividend that ranks ahead of common equity but behind all debt, usually without a vote.',
    note: 'Economically a hybrid. Cumulative preference shares accrue missed dividends; non-cumulative do not.',
    topics: ['cfa-l1-equity'],
  },
  {
    key: 'market-capitalisation',
    term: 'Market capitalisation',
    aka: ['market cap'],
    definition:
      'Share price multiplied by shares outstanding — the market value of a company’s equity.',
    note: 'Not the value of the firm. Enterprise value adds net debt, and is what you compare against EBITDA or EBIT.',
    topics: ['cfa-l1-equity'],
  },
  {
    key: 'enterprise-value',
    term: 'Enterprise value',
    aka: ['EV'],
    definition:
      'The value of the whole business regardless of how it is financed: market capitalisation plus debt and minorities, less cash.',
    formula: 'EV = Market cap + Debt + Minority interest − Cash',
    note: 'Pair EV with pre-interest metrics such as EBITDA or EBIT; pair market cap with post-interest metrics such as net income.',
    topics: ['cfa-l1-equity', 'cfa-l2-equity'],
  },
  {
    key: 'price-earnings',
    term: 'Price-to-earnings ratio',
    aka: ['P/E', 'PE ratio'],
    definition: 'Share price divided by earnings per share.',
    note: 'Meaningless when earnings are negative or near zero, and heavily affected by accounting choices. Trailing uses reported earnings; forward uses forecasts.',
    topics: ['cfa-l1-equity', 'cfa-l2-equity'],
  },
  {
    key: 'earnings-per-share',
    term: 'Earnings per share',
    aka: ['EPS'],
    definition:
      'Net income available to common shareholders, divided by the weighted average shares outstanding.',
    note: 'Diluted EPS assumes every in-the-money convertible, option and warrant converts. It is the conservative figure and the one that gets compared.',
    topics: ['cfa-l1-equity', 'cfa-l1-fsa'],
  },
  {
    key: 'dividend-discount-model',
    term: 'Dividend discount model',
    aka: ['DDM', 'Gordon growth model'],
    definition: 'Valuing a share as the present value of its expected future dividends.',
    formula: 'V₀ = D₁ / (r − g)',
    note: 'Requires r > g and a dividend that actually grows at a constant rate. Extremely sensitive to the denominator — a half-point change in g can move the value by a third.',
    topics: ['cfa-l1-equity', 'cfa-l2-equity'],
  },
  {
    key: 'required-rate-of-return',
    term: 'Required rate of return',
    definition: 'The minimum return an investor demands for holding an asset, given its risk.',
    topics: ['cfa-l1-equity', 'cfa-l1-pm'],
  },
  {
    key: 'sustainable-growth-rate',
    term: 'Sustainable growth rate',
    definition:
      'The rate at which a firm can grow without changing its capital structure or issuing new equity.',
    formula: 'g = ROE × retention ratio',
    topics: ['cfa-l1-equity'],
  },
  {
    key: 'market-efficiency',
    term: 'Market efficiency',
    aka: ['efficient market hypothesis', 'EMH'],
    definition:
      'The proposition that prices already reflect available information, so consistently beating the market on that information is not possible.',
    note: 'Three forms: weak (past prices), semi-strong (all public information), strong (all information, public and private). Technical analysis fails under weak-form; fundamental analysis fails under semi-strong.',
    topics: ['cfa-l1-equity', 'cfa-l1-pm'],
  },
  {
    key: 'price-index',
    term: 'Price-weighted index',
    definition: 'An index in which each constituent’s weight is proportional to its share price.',
    note: 'A high-priced share dominates regardless of company size, and a split changes the weights without changing anything real. The Dow is the famous example.',
    topics: ['cfa-l1-equity'],
  },
  {
    key: 'cap-weighted-index',
    term: 'Market-capitalisation-weighted index',
    definition: 'An index in which weights are proportional to constituents’ market values.',
    note: 'Self-rebalancing, and the only weighting every investor could hold at once. Its criticism is that it systematically holds more of whatever has already risen.',
    topics: ['cfa-l1-equity', 'cfa-l1-pm'],
  },
  {
    key: 'free-float',
    term: 'Free float',
    definition:
      'The portion of a company’s shares actually available to public investors, excluding strategic and locked-up holdings.',
    note: 'Index providers weight by free float so the index remains replicable.',
    topics: ['cfa-l1-equity'],
  },
  {
    key: 'short-selling',
    term: 'Short selling',
    definition: 'Selling borrowed securities in the expectation of buying them back cheaper.',
    note: 'Loss is theoretically unlimited, and the borrow can be recalled at the worst moment. That asymmetry is what makes a short squeeze possible.',
    topics: ['cfa-l1-equity', 'frm-p1-markets'],
  },
  {
    key: 'margin-equity',
    term: 'Margin (equity trading)',
    definition: 'Borrowing from a broker to buy securities, using the securities as collateral.',
    note: 'A margin call comes when equity falls below the maintenance margin. Leverage magnifies both the return and the speed of the call.',
    topics: ['cfa-l1-equity', 'frm-p1-markets'],
  },
  {
    key: 'book-value',
    term: 'Book value',
    definition: 'The accounting value of equity: assets less liabilities as reported.',
    note: 'Price-to-book works best where assets are marked near fair value — banks — and worst where value is intangible.',
    topics: ['cfa-l1-equity', 'cfa-l1-fsa'],
  },
];
