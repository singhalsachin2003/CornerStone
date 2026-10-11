---
title: "Market Risk Measurement & Management — Part II sample questions"
description: "Market Risk Measurement & Management: weight band, learning modules and 5 worked sample questions for Part II candidates."
permalink: /frm/p2-market/
---

# Market Risk Measurement & Management

*FRM® Part II, published weight 20%.* VaR and ES estimation, backtesting, EVT, GARCH, copulas, FRTB.

## What the outline covers

- VaR estimation approaches and their limitations; backtesting VaR
- Expected Shortfall and other coherent measures; parametric and non-parametric estimation
- Extreme value theory and tail risk
- Volatility modelling: GARCH, EWMA, implied volatility surfaces
- Correlation and copulas
- Fixed-income and term-structure models; interest rate risk hedging
- Volatility smiles; exotic and mortgage-backed products
- Fundamental Review of the Trading Book (FRTB)

## Sample questions

These 5 questions are free in the app too. Try each one before opening the answer.

### Question 1

A portfolio has a 1-day 99% VaR of $2.5m. Assuming i.i.d. returns, the 10-day 99% VaR is closest to:

> VaR(1) = $2.5m · T = 10

A. $7.9m  
B. $25.0m  
C. $2.5m  
D. $5.0m  

<details markdown="1">
<summary>Show the answer</summary>

**A.** √10 ≈ 3.162, so 2.5 × 3.162 ≈ $7.9m. Square-root-of-time scaling requires independent, identically distributed returns.

*Reading: Market Risk — VaR Measurement*

</details>

### Question 2

A bank’s 99% 1-day VaR model produced 9 exceptions in 250 trading days. This most likely indicates:

> Expected exceptions = 0.01 × 250 = 2.5

A. The model overstates risk  
B. The model is well calibrated  
C. The model understates risk  
D. Nothing without expected shortfall data  

<details markdown="1">
<summary>Show the answer</summary>

**C.** Nine breaches against 2.5 expected is far more than chance would suggest — the model understates risk and falls into the Basel red zone.

*Reading: Market Risk — Backtesting VaR*

</details>

### Question 3

Breaches of a VaR model cluster in a single stressed week rather than occurring evenly. The most appropriate test is:

A. Kupiec's unconditional coverage test  
B. Christoffersen's conditional coverage test  
C. A Jarque–Bera normality test  
D. A Dickey–Fuller unit root test  

<details markdown="1">
<summary>Show the answer</summary>

**B.** Kupiec tests only the number of exceptions. Christoffersen adds an independence test, which is what detects clustering.

*Reading: Market Risk — Backtesting VaR*

</details>

### Question 4

In extreme value theory using the peaks-over-threshold approach, a positive shape parameter ξ indicates:

A. Tails thinner than the normal distribution  
B. Tails fatter than the normal distribution  
C. A bounded loss distribution  
D. That the threshold was set too low  

<details markdown="1">
<summary>Show the answer</summary>

**B.** A positive ξ corresponds to the Fréchet domain — heavy tails, decaying more slowly than the normal distribution.

*Reading: Market Risk — Extreme Value Theory*

</details>

### Question 5

The Gaussian copula was widely criticised after 2008 primarily because it:

A. Cannot join different marginal distributions  
B. Exhibits zero tail dependence  
C. Requires equal marginals for all variables  
D. Cannot be calibrated to market data  

<details markdown="1">
<summary>Show the answer</summary>

**B.** The Gaussian copula implies assets become independent in the extreme tail, exactly the opposite of observed crisis behaviour. Student t copulas admit tail dependence.

*Reading: Market Risk — Correlation and Copulas*

</details>

## Practise more

The app adds snapshot cards, timed question sessions and a spaced-repetition review queue for this topic area, and works offline.

[Get Cornerstone on Google Play (Android)](/CornerStone/get/?c=web)

[All FRM topic areas](/CornerStone/frm/) · [FRM glossary](/CornerStone/glossary/frm/)

*Cornerstone is an independent study aid. It is not affiliated with, authorised by, endorsed by or sponsored by GARP.*
