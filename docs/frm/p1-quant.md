---
title: "Quantitative Analysis — Part I sample questions"
description: "Quantitative Analysis: weight band, learning modules and 5 worked sample questions for Part I candidates."
permalink: /frm/p1-quant/
---

# Quantitative Analysis

*FRM® Part I, published weight 20%.* Probability, hypothesis testing, regression, time series, volatility, simulation.

## What the outline covers

- Probability, Bayes' rule, random variables and common distributions
- Sample moments and hypothesis testing
- Linear regression; multiple regression and regression diagnostics
- Stationary and non-stationary time series
- Measuring volatility and correlation
- Simulation methods and bootstrapping
- Machine learning and prediction

## Sample questions

These 5 questions are free in the app too. Try each one before opening the answer.

### Question 1

A test for a rare condition has 95% sensitivity and 95% specificity. The condition affects 1% of the population. Given a positive result, the probability the condition is present is closest to:

> P(D) = 1% · sensitivity 95% · specificity 95%

A. 16%  
B. 48%  
C. 85%  
D. 95%  

<details markdown="1">
<summary>Show the answer</summary>

**A.** P(D|+) = (0.95 × 0.01)/[(0.95 × 0.01) + (0.05 × 0.99)] = 0.0095/0.0590 = 16.1%. Base rates dominate when the event is rare.

*Reading: Quantitative Analysis — Bayes' Rule*

</details>

### Question 2

A GARCH(1,1) model is estimated with α = 0.08 and β = 0.90. Persistence and the implication for volatility are:

> α = 0.08 · β = 0.90

A. 0.98 — volatility mean-reverts slowly  
B. 0.98 — volatility mean-reverts quickly  
C. 0.82 — the model is non-stationary  
D. 1.00 — the model reduces to EWMA  

<details markdown="1">
<summary>Show the answer</summary>

**A.** Persistence is α + β = 0.98, close to one, so shocks decay slowly and volatility mean-reverts only gradually. At exactly 1.00 it becomes EWMA.

*Reading: Quantitative Analysis — Measuring Volatility*

</details>

### Question 3

An analyst regresses one random walk on an unrelated random walk and obtains an R² of 0.78 with a significant t-statistic. The correct conclusion is that:

A. A genuine economic relationship exists  
B. The regression is spurious because both series are non-stationary  
C. The sample size is too small  
D. Heteroskedasticity is present  

<details markdown="1">
<summary>Show the answer</summary>

**B.** Regressing non-stationary series produces spuriously high R² and significant t-statistics with no underlying relationship. Difference the series first.

*Reading: Quantitative Analysis — Stationary and Non-Stationary Time Series*

</details>

### Question 4

Lowering the significance level of a hypothesis test from 5% to 1% will:

A. Reduce Type I error and reduce Type II error  
B. Reduce Type I error and increase Type II error  
C. Increase Type I error and reduce Type II error  
D. Leave both error rates unchanged  

<details markdown="1">
<summary>Show the answer</summary>

**B.** A stricter threshold makes rejection harder, cutting false rejections (Type I) but raising failures to reject a false null (Type II).

*Reading: Quantitative Analysis — Hypothesis Testing*

</details>

### Question 5

Compared with GARCH(1,1), the EWMA model:

A. Includes a long-run variance term and mean-reverts  
B. Omits the long-run variance term and does not mean-revert  
C. Requires a normality assumption GARCH does not  
D. Cannot be estimated from historical returns  

<details markdown="1">
<summary>Show the answer</summary>

**B.** EWMA is GARCH(1,1) with ω = 0 and α + β = 1, so there is no long-run variance to revert to.

*Reading: Quantitative Analysis — Measuring Volatility and Correlation*

</details>

## Practise more

The app adds snapshot cards, timed question sessions and a spaced-repetition review queue for this topic area, and works offline.

[Get Cornerstone on Google Play (Android)](/CornerStone/get/)

[All FRM topic areas](/CornerStone/frm/) · [FRM glossary](/CornerStone/glossary/frm/)

*Cornerstone is an independent study aid. It is not affiliated with, authorised by, endorsed by or sponsored by GARP.*
