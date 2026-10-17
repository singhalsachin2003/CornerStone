---
title: "Quantitative Methods — CFA Level II sample questions"
description: "Quantitative Methods: weight band, learning modules and 5 worked sample questions for CFA Level II candidates."
permalink: /cfa/l2-quant/
---

# Quantitative Methods

*CFA® Level II, published weight 5–10%.* Multiple regression, misspecification, time series, machine learning.

## What the outline covers

- Basics of Multiple Regression and Underlying Assumptions
- Evaluating Regression Model Fit and Interpreting Model Results
- Model Misspecification
- Extensions of Multiple Regression
- Time-Series Analysis
- Machine Learning
- Big Data Projects

## Sample questions

These 5 questions are free in the app too. Try each one before opening the answer.

### Question 1

A multiple regression reports a significant F-statistic but no individually significant t-statistics. This most likely indicates:

A. Heteroskedasticity  
B. Serial correlation  
C. Multicollinearity  
D. A unit root  

<details markdown="1">
<summary>Show the answer</summary>

**C.** Multicollinearity inflates the standard errors of individual coefficients while leaving the joint explanatory power intact — exactly this signature.

*Reading: Quantitative Methods — Model Misspecification, LOS 3.b*

</details>

### Question 2

Adding a variable to a regression raises R² from 0.42 to 0.44 but lowers adjusted R² from 0.39 to 0.38. The analyst should conclude the variable:

> R²: 0.42 → 0.44 · R̄²: 0.39 → 0.38

A. Improves the model and should be retained  
B. Does not justify its loss of degrees of freedom  
C. Introduces heteroskedasticity  
D. Makes the model non-stationary  

<details markdown="1">
<summary>Show the answer</summary>

**B.** R² always rises with an added regressor. A falling adjusted R² means the explanatory gain does not compensate for the lost degree of freedom.

*Reading: Quantitative Methods — Evaluating Regression Model Fit, LOS 2.c*

</details>

### Question 3

An AR(1) model is estimated on a series with a unit root. The most appropriate remedy is to:

A. Add a lag to the model  
B. First-difference the series  
C. Use White-corrected standard errors  
D. Apply a log transformation to the dependent variable  

<details markdown="1">
<summary>Show the answer</summary>

**B.** A unit root violates covariance stationarity and produces spurious results. First differencing typically restores stationarity.

*Reading: Quantitative Methods — Time-Series Analysis, LOS 5.f*

</details>

### Question 4

Conditional heteroskedasticity in a regression most directly causes:

A. Biased coefficient estimates  
B. Unreliable standard errors and invalid t-tests  
C. A spurious unit root  
D. Perfect multicollinearity  

<details markdown="1">
<summary>Show the answer</summary>

**B.** Coefficients remain unbiased and consistent, but the standard errors are wrong, so hypothesis tests based on them are invalid.

*Reading: Quantitative Methods — Model Misspecification, LOS 3.a*

</details>

### Question 5

A machine learning model shows very low training error and substantially higher validation error. This is best described as:

A. Underfitting  
B. Overfitting  
C. Data leakage  
D. Correct generalisation  

<details markdown="1">
<summary>Show the answer</summary>

**B.** A large gap between training and validation performance means the model has fitted noise in the training sample rather than signal.

*Reading: Quantitative Methods — Machine Learning, LOS 6.c*

</details>


## Practise more

The app adds snapshot cards, timed question sessions and a spaced-repetition review queue for this topic area, and works offline.

[Get Cornerstone on Google Play (Android)](/CornerStone/get/?c=web)

[Follow the daily questions on WhatsApp](https://whatsapp.com/channel/0029Vb9LcPUFXUudEZ6Hm61m)

[All CFA topic areas](/CornerStone/cfa/) · [CFA glossary](/CornerStone/glossary/cfa/)

*Cornerstone is an independent study aid. It is not affiliated with, authorised by, endorsed by or sponsored by CFA Institute.*
