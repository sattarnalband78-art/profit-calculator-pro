import { CalculationResult } from '../types';
import { AppLanguage } from './translations';
import { formatINR, formatPercent } from './formatters';

export interface GeneratedAdvice {
  text: string;
  source: 'gemini' | 'engine';
}

/**
 * Generates context-aware, highly actionable business advice for small business owners,
 * traders, and shopkeepers across Hindi, Marathi, and English.
 * Works offline and inside standalone Android APKs without requiring a local Express server.
 */
export function generateExpertBusinessAdvice(
  result: CalculationResult,
  language: AppLanguage
): string {
  const {
    productName,
    costPrice,
    sellingPrice,
    quantity,
    totalSales,
    totalProfit,
    profitPerPiece,
    profitPercentage,
    profitMarginOnSales,
    isProfit,
    isLoss,
  } = result;

  const safeName = productName && productName.trim() ? productName.trim() : 'Product';

  if (language === 'hi') {
    // 1. Profit Status Header & Sentence
    let statusSentence = '';
    if (isLoss) {
      statusSentence = `सावधान: वर्तमान में **${safeName}** पर प्रति पीस **${formatINR(Math.abs(profitPerPiece))}** का नुकसान हो रहा है, जिससे **${quantity}** पीस की बिक्री पर कुल **${formatINR(Math.abs(totalProfit))}** की हानि हो रही है। लागत से कम मूल्य पर बेचना तुरंत रोकें।`;
    } else if (!isProfit) {
      statusSentence = `वर्तमान में **${safeName}** लागत मूल्य पर बिक रहा है (नो-प्रॉफिट, नो-लॉस)। ₹0 का शुद्ध मुनाफ़ा हो रहा है; सकारात्मक नकदी प्रवाह के लिए मूल्य संशोधन आवश्यक है।`;
    } else {
      statusSentence = `वर्तमान में **${safeName}** पर प्रति पीस **${formatINR(profitPerPiece)}** का शुद्ध मुनाफ़ा मिल रहा है, और **${quantity}** पीस पर आपका कुल मुनाफ़ा **${formatINR(totalProfit)}** (ROI: **${formatPercent(profitPercentage, true)}**, मार्जिन: **${formatPercent(profitMarginOnSales, true)}**) है।`;
    }

    // 2. Target Milestone Sentence
    let targetSentence = '';
    if (isLoss) {
      const suggestedSellingPrice = Math.ceil(costPrice * 1.15);
      targetSentence = `नुकसान समाप्त कर 15% न्यूनतम मुनाफ़ा कमाने के लिए सेलिंग प्राइस को कम से कम **${formatINR(suggestedSellingPrice)}** निर्धारित करें या सप्लायर से लागत दर घटाएँ।`;
    } else if (!isProfit) {
      const target20Price = Math.ceil(costPrice * 1.2);
      const targetProfit20 = Math.round((target20Price - costPrice) * quantity);
      targetSentence = `प्रति पीस 20% मुनाफ़े के लिए सेलिंग प्राइस **${formatINR(target20Price)}** रखें, जिससे **${quantity}** पीस पर **${formatINR(targetProfit20)}** का सीधा शुद्ध मुनाफ़ा मिलेगा।`;
    } else {
      // Calculate realistic next milestone
      let targetProfitGoal = totalProfit * 2;
      if (totalProfit < 2000) targetProfitGoal = 5000;
      else if (totalProfit < 10000) targetProfitGoal = 25000;
      else if (totalProfit < 25000) targetProfitGoal = 50000;

      const targetUnits = Math.ceil(targetProfitGoal / profitPerPiece);
      const targetRevenue = targetUnits * sellingPrice;
      targetSentence = `यदि आप बिक्री मात्रा बढ़ाकर **${targetUnits.toLocaleString('en-IN')} पीस** कर लेते हैं, तो आपका कुल शुद्ध मुनाफ़ा बढ़कर **${formatINR(targetProfitGoal)}** हो जाएगा (कुल बिक्री लक्ष्य: **${formatINR(targetRevenue)}**)।`;
    }

    // 3. Actionable Business Tip
    let tipSentence = '';
    if (isLoss) {
      tipSentence = `परिवहन, पैकेजिंग और वेस्टेज लागत का ऑडिट करें। जब तक सप्लायर से थोक छूट न मिले या सेलिंग प्राइस न बढ़ाई जाए, नए बैच का स्टॉक न मंगाएँ।`;
    } else if (profitPercentage >= 40) {
      tipSentence = `यह एक उच्च-मार्जिन वाला उत्पाद है। 2 या 3 पीस का वैल्यू पैक / कॉम्बो बनाकर बेचें ताकि प्रति ग्राहक बिल साइज बढ़े और स्टॉक तेज़ी से रोटेट हो।`;
    } else if (profitPercentage < 15) {
      const priceBump = Math.max(1, Math.round(sellingPrice * 0.05));
      const extraProfit = priceBump * quantity;
      tipSentence = `कम मार्जिन में कैश फ्लो बनाए रखना ज़रूरी है। सेलिंग प्राइस में केवल **${formatINR(priceBump)}** की मामूली वृद्धि करने से आपको **${formatINR(extraProfit)}** का अतिरिक्त शुद्ध मुनाफ़ा मिलेगा।`;
    } else {
      const costSave = Math.max(1, Math.round(costPrice * 0.05));
      const extraProfitCost = costSave * quantity;
      tipSentence = `सप्लायर से थोक खरीद पर 5% अतिरिक्त छूट की मांग करें। प्रति पीस केवल **${formatINR(costSave)}** बचाने से आपको **${formatINR(extraProfitCost)}** का अतिरिक्त मुनाफ़ा बिना दाम बढ़ाए मिलेगा।`;
    }

    return `• **मुनाफ़ा स्थिति**: ${statusSentence}\n• **बिक्री लक्ष्य**: ${targetSentence}\n• **व्यापारिक सलाह**: ${tipSentence}`;
  }

  if (language === 'mr') {
    // Marathi Language Branch
    let statusSentence = '';
    if (isLoss) {
      statusSentence = `सावधान: सध्या **${safeName}** वर प्रति नग **${formatINR(Math.abs(profitPerPiece))}** चे नुकसान होत असून, **${quantity}** नगांवर एकूण **${formatINR(Math.abs(totalProfit))}** चा तोटा होत आहे. खरेदी किंमतीपेक्षा कमी दराने विक्री त्वरित थांबवा.`;
    } else if (!isProfit) {
      statusSentence = `सध्या **${safeName}** खरेदी मूल्यातच विकले जात आहे (ना नफा ना तोटा). ₹0 चा निव्वळ नफा असून, सकारात्मक रोख प्रवाहासाठी विक्री मूल्यात सुधारणा आवश्यक आहे.`;
    } else {
      statusSentence = `सध्या **${safeName}** वर प्रति नग **${formatINR(profitPerPiece)}** चा निव्वळ नफा मिळत असून, **${quantity}** नगांच्या एकूण विक्रीवर तुमचा एकूण नफा **${formatINR(totalProfit)}** (ROI: **${formatPercent(profitPercentage, true)}**, मार्जिन: **${formatPercent(profitMarginOnSales, true)}**) आहे.`;
    }

    let targetSentence = '';
    if (isLoss) {
      const suggestedSellingPrice = Math.ceil(costPrice * 1.15);
      targetSentence = `तोटा भरून काढून किमान 15% नफा मिळवण्यासाठी विक्री किंमत किमान **${formatINR(suggestedSellingPrice)}** निश्चित करा किंवा पुरवठादाराकडून खरेदी दर कमी करा.`;
    } else if (!isProfit) {
      const target20Price = Math.ceil(costPrice * 1.2);
      const targetProfit20 = Math.round((target20Price - costPrice) * quantity);
      targetSentence = `प्रति नग 20% नफ्यासाठी विक्री किंमत **${formatINR(target20Price)}** ठेवा, ज्यामुळे **${quantity}** नगांवर **${formatINR(targetProfit20)}** चा थेट नफा होईल.`;
    } else {
      let targetProfitGoal = totalProfit * 2;
      if (totalProfit < 2000) targetProfitGoal = 5000;
      else if (totalProfit < 10000) targetProfitGoal = 25000;
      else if (totalProfit < 25000) targetProfitGoal = 50000;

      const targetUnits = Math.ceil(targetProfitGoal / profitPerPiece);
      const targetRevenue = targetUnits * sellingPrice;
      targetSentence = `जर तुम्ही विक्री वाढवून **${targetUnits.toLocaleString('en-IN')} नग** केली, तर तुमचा एकूण निव्वळ नफा वाढून **${formatINR(targetProfitGoal)}** होईल (आवश्यक एकूण महसूल: **${formatINR(targetRevenue)}**).`;
    }

    let tipSentence = '';
    if (isLoss) {
      tipSentence = `वाहतूक, पॅकेजिंग आणि वेस्टेजचे त्वरित ऑडिट करा. जोपर्यंत खरेदी दर कमी होत नाही किंवा विक्री किंमत वाढत नाही, तोपर्यंत नवीन स्टॉक घेणे टाळा.`;
    } else if (profitPercentage >= 40) {
      tipSentence = `हे उच्च नफा देणारे उत्पादन आहे. 2 किंवा 3 नगांचा कॉम्बो पॅक तयार करून विका, जेणेकरून ग्राहकांकडून येणारी एकूण रक्कम वाढेल आणि स्टॉक जलद रिकामा होईल.`;
    } else if (profitPercentage < 15) {
      const priceBump = Math.max(1, Math.round(sellingPrice * 0.05));
      const extraProfit = priceBump * quantity;
      tipSentence = `कमी नफ्यामध्ये रोख प्रवाह चालू ठेवणे महत्त्वाचे आहे. विक्री किंमतीत फक्त **${formatINR(priceBump)}** ची वाढ केल्यास तुम्हाला **${formatINR(extraProfit)}** चा अतिरिक्त नफा मिळेल.`;
    } else {
      const costSave = Math.max(1, Math.round(costPrice * 0.05));
      const extraProfitCost = costSave * quantity;
      tipSentence = `पुरवठादाराकडून मोठ्या खरेदीवर 5% अतिरिक्त सवलत मिळवा. प्रति नग फक्त **${formatINR(costSave)}** वाचवून तुम्ही **${formatINR(extraProfitCost)}** चा अतिरिक्त नफा कमवू शकता.`;
    }

    return `• **नफा स्थिती**: ${statusSentence}\n• **विक्री उद्दिष्ट**: ${targetSentence}\n• **व्यावसायिक सल्ला**: ${tipSentence}`;
  }

  // English Language Default
  let statusSentence = '';
  if (isLoss) {
    statusSentence = `Warning: Currently operating at a loss of **${formatINR(Math.abs(profitPerPiece))}** per unit on **${safeName}**, totaling **${formatINR(Math.abs(totalProfit))}** in net deficit across **${quantity}** units. Selling below unit cost should be corrected immediately.`;
  } else if (!isProfit) {
    statusSentence = `Currently operating strictly at break-even (₹0 net profit). Adjusting pricing or procurement terms is necessary to generate positive cash flow.`;
  } else {
    statusSentence = `Currently earning a healthy net profit of **${formatINR(profitPerPiece)}** per unit on **${safeName}**, totaling **${formatINR(totalProfit)}** across **${quantity}** units (ROI: **${formatPercent(profitPercentage, true)}**, Margin: **${formatPercent(profitMarginOnSales, true)}**).`;
  }

  let targetSentence = '';
  if (isLoss) {
    const suggestedSellingPrice = Math.ceil(costPrice * 1.15);
    targetSentence = `To eliminate loss and achieve a sustainable 15% margin, adjust selling price to at least **${formatINR(suggestedSellingPrice)}** or negotiate lower wholesale procurement rates.`;
  } else if (!isProfit) {
    const target20Price = Math.ceil(costPrice * 1.2);
    const targetProfit20 = Math.round((target20Price - costPrice) * quantity);
    targetSentence = `Target a selling price of **${formatINR(target20Price)}** to secure a 20% return, generating **${formatINR(targetProfit20)}** in net profit on **${quantity}** units.`;
  } else {
    let targetProfitGoal = totalProfit * 2;
    if (totalProfit < 2000) targetProfitGoal = 5000;
    else if (totalProfit < 10000) targetProfitGoal = 25000;
    else if (totalProfit < 25000) targetProfitGoal = 50000;

    const targetUnits = Math.ceil(targetProfitGoal / profitPerPiece);
    const targetRevenue = targetUnits * sellingPrice;
    targetSentence = `Scaling sales volume to **${targetUnits.toLocaleString('en-IN')} units** will expand your total net profit to **${formatINR(targetProfitGoal)}** (requiring total gross revenue of **${formatINR(targetRevenue)}**).`;
  }

  let tipSentence = '';
  if (isLoss) {
    tipSentence = `Audit transport, packaging, and shrinkage costs. Pause restocking until you renegotiate distributor terms or recalibrate your retail price.`;
  } else if (profitPercentage >= 40) {
    tipSentence = `This is a high-margin product. Create bundled value packs or premium presentation to raise average ticket size and accelerate inventory velocity.`;
  } else if (profitPercentage < 15) {
    const priceBump = Math.max(1, Math.round(sellingPrice * 0.05));
    const extraProfit = priceBump * quantity;
    tipSentence = `Thin margin requires strict cash-flow velocity. Introducing a modest **${formatINR(priceBump)}** price optimization will inject **${formatINR(extraProfit)}** directly into your net profit.`;
  } else {
    const costSave = Math.max(1, Math.round(costPrice * 0.05));
    const extraProfitCost = costSave * quantity;
    tipSentence = `Negotiate a 5% bulk procurement discount with your distributor to directly inject an extra **${formatINR(extraProfitCost)}** into your bottom line without increasing retail prices.`;
  }

  return `• **Profit Status**: ${statusSentence}\n• **Sales Target**: ${targetSentence}\n• **Business Advice**: ${tipSentence}`;
}
