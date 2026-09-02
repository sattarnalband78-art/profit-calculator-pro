export type AppLanguage = 'en' | 'hi' | 'mr';

export interface Translations {
  // Header
  appTitle: string;
  appTitlePro: string;
  appSubtitle: string;
  currencyBadge: string;
  langLabel: string;
  sampleDataBtn: string;
  clearBtn: string;

  // Input Form
  productDetailsTitle: string;
  productDetailsSubtitle: string;
  voiceLabel: string;
  voiceListening: string;
  voiceListeningPrompt: string;
  voiceStopBtn: string;
  voiceUnsupported: string;
  productNameLabel: string;
  productNamePlaceholder: string;
  skuHelper: string;
  costPriceLabel: string;
  costPricePlaceholder: string;
  costPriceHint: string;
  unitBadgeCost: string;
  sellingPriceLabel: string;
  sellingPricePlaceholder: string;
  sellingPriceHint: string;
  unitBadgeSelling: string;
  quantityLabel: string;
  quantityPlaceholder: string;
  quantityHint: string;
  qtyHelper: string;
  resetBtn: string;
  calculateBtn: string;
  calculateProfitBtn: string;
  updateProductBtn: string;
  cancelEditBtn: string;
  editingProductBanner: string;

  // Validation
  errProductNameReq: string;
  errCostPriceReq: string;
  errCostPriceNeg: string;
  errSellingPriceReq: string;
  errSellingPriceNeg: string;
  errQuantityReq: string;
  errQuantityMin: string;

  // Results Grid & Business Health
  productPrefix: string;
  unnamedProduct: string;
  shareBtn: string;
  copiedMsg: string;
  printBtn: string;
  businessReportTitle: string;
  downloadPdfBtn: string;
  generatingPdf: string;
  pdfDownloadedSuccess: string;
  pdfGenError: string;
  pdfSaveReport: string;
  openPrintDialogBtn: string;
  printingStatus: string;
  previewReportTitle: string;
  saveLogBtn: string;
  savedLogBtn: string;
  profitStatusTitle: string;
  profitStatusSubtitle: string;
  lossStatusTitle: string;
  lossStatusSubtitle: string;
  breakEvenStatusTitle: string;
  breakEvenStatusSubtitle: string;
  healthExcellentProfit: string;
  healthGoodProfit: string;
  healthLowProfit: string;
  healthLossStatus: string;
  healthBreakEvenStatus: string;
  totalSalesLabel: string;
  revenueBadge: string;
  totalCostLabel: string;
  expensesBadge: string;
  netProfitLabel: string;
  netLossLabel: string;
  surplusBadge: string;
  deficitBadge: string;
  profitPerPieceLabel: string;
  lossPerPieceLabel: string;
  roiLabel: string;
  marginLabel: string;
  roiShort: string;
  marginShort: string;
  unitsTimes: string;
  perUnit: string;
  shareFooter: string;
  yourProfitHeading: string;
  yourLossHeading: string;
  yourProfitPerPiece: string;
  yourLossPerPiece: string;
  profitShareInSales: string;
  howItWorksBtn: string;

  // Empty State
  emptyTitle: string;
  emptySubtitle: string;
  badgeSales: string;
  badgeCost: string;
  badgeProfitLoss: string;
  badgeReturn: string;

  // Smart Business Insights Section
  smartInsightsTitle: string;
  smartInsightsSubtitle: string;
  moreToolsTitle: string;
  moreToolsSubtitle: string;
  fourToolsBadge: string;
  profitBoostersTitle: string;
  profitBoostersSubtitle: string;
  profitBoosterPriceUp: string;
  profitBoosterCostDown: string;
  profitBoosterQtyUp: string;
  extraProfitText: string;
  quickWinsBadge: string;
  smallChangesMultiplyText: string;

  // Target Profit (I want to earn)
  targetProfitTitle: string;
  targetProfitSubtitle: string;
  goalBadge: string;
  iWantToEarnLabel: string;
  youNeedToSellLabel: string;
  desiredProfitLabel: string;
  quickProfitPresets: string;
  requiredQuantity: string;
  projectedRevenue: string;
  projectedCost: string;
  applyQtyBtn: string;
  qtyAppliedToast: string;
  cannotReachProfitWarning: string;
  targetProfitSimpleExplain: string;
  targetProfitSteps: string[];

  // Find My Best Selling Price
  targetFinderTitle: string;
  targetFinderSubtitle: string;
  findBestPriceTitle: string;
  assistantBadge: string;
  costLabel: string;
  targetReturnLabel: string;
  quickMarginsLabel: string;
  suggestedSellingPrice: string;
  projectedProfitPerUnit: string;
  applyPriceBtn: string;
  appliedToast: string;
  targetPriceSimpleExplain: string;
  targetReturnSteps: string[];

  // What-If Simulator (What If I Change My Price?)
  whatIfTitle: string;
  whatIfSimpleTitle: string;
  whatIfSubtitle: string;
  simulatorBadge: string;
  currentScenario: string;
  simulatedScenario: string;
  differenceDelta: string;
  adjustCost: string;
  adjustSelling: string;
  adjustQuantity: string;
  applyScenarioBtn: string;
  scenarioAppliedToast: string;
  resetScenarioBtn: string;
  whatIfSteps: string[];

  // Compare Prices
  smartPricingTitle: string;
  comparePricesSimpleTitle: string;
  smartPricingSubtitle: string;
  pricingBadge: string;
  pricingDisclaimer: string;
  currentPriceLabel: string;
  tierCompetitive: string;
  tierStandard: string;
  tierHealthy: string;
  tierHigh: string;
  tierPremium: string;
  tierLuxury: string;
  useThisPrice: string;
  smartPricingSteps: string[];
  profitPerPieceText: string;

  // AI Business Advisor
  myBusinessAdviceTitle: string;
  getBusinessAdviceBtn: string;
  aiAdvisorTitle: string;
  aiAdvisorSubtitle: string;
  aiBadge: string;
  localAnalysisTitle: string;
  localAnalysisBadge: string;
  aiUnavailableNotice: string;
  askGeminiBtn: string;
  retryAiBtn: string;
  generatingAdvice: string;
  healthVerdictTitle: string;
  healthStrong: string;
  healthModerate: string;
  healthThin: string;
  healthLoss: string;
  healthBreakEven: string;
  milestonesTitle: string;
  targetUnits: string;
  revenueRequired: string;
  optimizationTitle: string;
  priceBumpTip: string;
  costReductionTip: string;
  aiDisclaimer: string;
  aiAdvisorSteps: string[];
  localSummaryProfit: string;
  localSummaryLoss: string;
  localSummaryBreakEven: string;

  // History Log / My Products / Ranking
  savedLogsTitle: string;
  myProductsTitle: string;
  totalSavedBadge: string;
  catalogSales: string;
  catalogCost: string;
  catalogProfit: string;
  catalogRoi: string;
  exportCsvBtn: string;
  clearHistoryBtn: string;
  searchProductsPlaceholder: string;
  noSearchMatch: string;
  noHistoryTitle: string;
  noHistoryDesc: string;
  loadItemTitle: string;
  deleteItemTitle: string;
  fillCalculatorBtn: string;
  editProductBtn: string;
  deleteProductBtn: string;
  statusProfit: string;
  statusLoss: string;
  statusBreakEven: string;
  pcsLabel: string;
  pieceLabel: string;
  profitLabelShort: string;
  lossLabelShort: string;
  totalSalesShort: string;
  rankingTabAll: string;
  rankingTabProfit: string;
  rankingTabRoi: string;
  rankingTabSales: string;
  rankBadge: string;
  topPerformerPodium: string;
  topProfitLabel: string;
  topRoiLabel: string;
  topSalesLabel: string;

  // Confirmations
  confirmDeleteTitle: string;
  confirmDeleteDesc: string;
  confirmClearTitle: string;
  confirmClearDesc: string;
  confirmYes: string;
  confirmClearYes: string;
  cancelDialogBtn: string;

  // Info Cards & Footer
  instantCalcTitle: string;
  instantCalcDesc: string;
  inrFormatTitle: string;
  inrFormatDesc: string;
  offlineFastTitle: string;
  offlineFastDesc: string;
  footerEngine: string;
  footerDesigned: string;
}

export const TRANSLATIONS: Record<AppLanguage, Translations> = {
  en: {
    appTitle: 'Profit Calculator',
    appTitlePro: 'Pro',
    appSubtitle: 'Calculate business profit, sales and margins easily',
    currencyBadge: '₹ INR',
    langLabel: 'Language:',
    sampleDataBtn: 'Sample Data',
    clearBtn: 'Clear',

    productDetailsTitle: 'Product Details',
    productDetailsSubtitle: 'Enter cost price, selling price and quantity',
    voiceLabel: 'Voice:',
    voiceListening: 'Listening...',
    voiceListeningPrompt: 'Listening... Speak now',
    voiceStopBtn: 'Stop',
    voiceUnsupported: 'Speech recognition is not supported in this browser. Please use Google Chrome.',
    productNameLabel: 'Product Name',
    productNamePlaceholder: 'Enter product name...',
    skuHelper: 'Name or SKU',
    costPriceLabel: 'Cost Price (₹)',
    costPricePlaceholder: '0.00',
    costPriceHint: 'Cost price per piece',
    unitBadgeCost: 'Cost',
    sellingPriceLabel: 'Selling Price (₹)',
    sellingPricePlaceholder: '0.00',
    sellingPriceHint: 'Selling price per piece',
    unitBadgeSelling: 'Selling',
    quantityLabel: 'Quantity',
    quantityPlaceholder: '0',
    quantityHint: 'Total pieces sold or produced',
    qtyHelper: 'Batch / Units',
    resetBtn: 'Reset',
    calculateBtn: 'Calculate Profit',
    calculateProfitBtn: 'Calculate Profit',
    updateProductBtn: 'Update Product',
    cancelEditBtn: 'Cancel Edit',
    editingProductBanner: 'Editing Product:',

    errProductNameReq: 'Product name is required',
    errCostPriceReq: 'Cost price is required',
    errCostPriceNeg: 'Cost price cannot be negative',
    errSellingPriceReq: 'Selling price is required',
    errSellingPriceNeg: 'Selling price cannot be negative',
    errQuantityReq: 'Quantity is required',
    errQuantityMin: 'Quantity must be at least 1',

    productPrefix: 'Product:',
    unnamedProduct: 'Unnamed Product',
    shareBtn: 'Share',
    copiedMsg: 'Summary Copied to Clipboard!',
    printBtn: 'Print / PDF',
    businessReportTitle: 'Business Profit Report',
    downloadPdfBtn: 'Download PDF',
    generatingPdf: 'Generating PDF...',
    pdfDownloadedSuccess: '✓ PDF Downloaded',
    pdfGenError: 'Could not generate PDF. Please try again.',
    pdfSaveReport: 'Save PDF',
    openPrintDialogBtn: 'Print',
    printingStatus: 'Printing...',
    previewReportTitle: 'PDF & Print Preview',
    saveLogBtn: 'Save Product',
    savedLogBtn: '✓ Saved',
    profitStatusTitle: 'PROFIT',
    profitStatusSubtitle: 'Net profit generated',
    lossStatusTitle: 'LOSS',
    lossStatusSubtitle: 'Operating at a loss',
    breakEvenStatusTitle: 'NO PROFIT NO LOSS',
    breakEvenStatusSubtitle: 'Selling price equals cost price with zero profit or loss.',
    healthExcellentProfit: 'Excellent Profit',
    healthGoodProfit: 'Good Profit',
    healthLowProfit: 'Low Profit',
    healthLossStatus: 'Loss',
    healthBreakEvenStatus: 'Break-Even',
    totalSalesLabel: 'Total Sales',
    revenueBadge: 'Sales',
    totalCostLabel: 'Total Cost',
    expensesBadge: 'Cost',
    netProfitLabel: 'Total Profit',
    netLossLabel: 'Total Loss',
    surplusBadge: 'Profit',
    deficitBadge: 'Loss',
    profitPerPieceLabel: 'Profit per Piece',
    lossPerPieceLabel: 'Loss per Piece',
    roiLabel: 'ROI (Return on Investment)',
    marginLabel: 'Sales Margin',
    roiShort: 'ROI',
    marginShort: 'Margin',
    unitsTimes: 'pieces ×',
    perUnit: 'piece',
    shareFooter: 'Calculated via NOMAN • Profit Calculator Pro (₹ INR)',
    yourProfitHeading: 'Your Profit',
    yourLossHeading: 'Your Loss',
    yourProfitPerPiece: 'Profit / piece',
    yourLossPerPiece: 'Loss / piece',
    profitShareInSales: 'Profit Share in Sales',
    howItWorksBtn: 'How it works?',

    emptyTitle: 'Calculate Your Business Profit in Seconds',
    emptySubtitle: 'Enter product name, cost per piece, selling price and quantity to instantly see your profit, sales, and profit margin.',
    badgeSales: '💰 Total Sales',
    badgeCost: '💸 Total Cost',
    badgeProfitLoss: '📈 Profit / Loss',
    badgeReturn: '📊 ROI %',

    // Smart Business Insights Section
    smartInsightsTitle: 'Smart Business Insights',
    smartInsightsSubtitle: 'Actionable calculations to increase your shop earnings',
    moreToolsTitle: 'More Business Tools',
    moreToolsSubtitle: 'Advanced simulators, goal finders, and comparison tools',
    fourToolsBadge: '4 Tools',
    profitBoostersTitle: 'Profit Boosters',
    profitBoostersSubtitle: 'Quick adjustments that directly increase your earnings',
    profitBoosterPriceUp: 'Increase price by ₹1',
    profitBoosterCostDown: 'Reduce cost by ₹1',
    profitBoosterQtyUp: 'Sell {qty} more pieces',
    extraProfitText: 'profit',
    quickWinsBadge: 'Quick Wins',
    smallChangesMultiplyText: 'Small changes multiply quickly across {qty} {unit}!',

    // Target Profit
    targetProfitTitle: 'Target Profit',
    targetProfitSubtitle: 'Enter how much you want to earn to see how many pieces to sell',
    goalBadge: 'Goal',
    iWantToEarnLabel: 'I want to earn',
    youNeedToSellLabel: 'You need to sell {qty} pieces.',
    desiredProfitLabel: 'Desired Total Profit (₹)',
    quickProfitPresets: 'Quick Targets:',
    requiredQuantity: 'Required Pieces to Sell',
    projectedRevenue: 'Total Sales',
    projectedCost: 'Total Cost',
    applyQtyBtn: 'Use Quantity in Form',
    qtyAppliedToast: 'Quantity Applied!',
    cannotReachProfitWarning: 'Selling price must be higher than cost price to calculate target profit.',
    targetProfitSimpleExplain: 'Sell {qty} pieces to make ₹{profit} total profit.',
    targetProfitSteps: [
      'Enter how much total profit you want to make (₹)',
      'App divides target profit by profit per piece',
      'Click Use Quantity in Form to apply directly',
    ],

    // Find My Best Selling Price
    targetFinderTitle: 'Find My Best Selling Price',
    targetFinderSubtitle: 'Find the right selling price based on your target profit.',
    findBestPriceTitle: 'Find My Best Selling Price',
    assistantBadge: 'Tool',
    costLabel: 'Cost Price (₹)',
    targetReturnLabel: 'Target Profit Percentage (%)',
    quickMarginsLabel: 'Quick Targets:',
    suggestedSellingPrice: 'Suggested Selling Price',
    projectedProfitPerUnit: 'Profit per piece:',
    applyPriceBtn: 'Use Selling Price',
    appliedToast: 'Price Applied!',
    targetPriceSimpleExplain: 'Sell at ₹{price} to make {return}% profit on ₹{cost} cost.',
    targetReturnSteps: [
      'Enter your cost price per piece',
      'Choose your desired profit return percentage',
      'App calculates the ideal selling price automatically',
    ],

    // What-If Simulator
    whatIfTitle: 'What If I Change My Price?',
    whatIfSimpleTitle: 'What If I Change My Price?',
    whatIfSubtitle: 'Change price, quantity or cost and see how profit updates immediately.',
    simulatorBadge: 'Simulator',
    currentScenario: 'Current',
    simulatedScenario: 'New Price',
    differenceDelta: 'Profit Change (Δ)',
    adjustCost: 'Cost (₹)',
    adjustSelling: 'Selling Price (₹)',
    adjustQuantity: 'Quantity',
    applyScenarioBtn: 'Use in Calculator',
    scenarioAppliedToast: 'Values Applied!',
    resetScenarioBtn: 'Reset',
    whatIfSteps: [
      'Tap percentage buttons (+5%, +10%) or enter new prices',
      'Compare new profit side-by-side with current profit',
      'Click Use in Calculator to apply',
    ],

    // Compare Prices
    smartPricingTitle: 'Compare Prices',
    comparePricesSimpleTitle: 'Compare Prices',
    smartPricingSubtitle: 'Compare profit across different selling price tiers at a glance.',
    pricingBadge: 'Pricing',
    pricingDisclaimer: 'See how much profit you make per piece at each selling price.',
    currentPriceLabel: 'Current Price',
    tierCompetitive: 'Budget / Low Price',
    tierStandard: 'Standard Price',
    tierHealthy: 'Good Profit Price',
    tierHigh: 'High Margin Price',
    tierPremium: 'Premium Price',
    tierLuxury: 'Special Luxury Price',
    useThisPrice: 'Use Price',
    smartPricingSteps: [
      'Review different selling prices based on your cost',
      'Check profit per piece for each price level',
      'Click Use Price on the option that suits your market',
    ],
    profitPerPieceText: 'profit / piece',

    // AI Business Advisor
    myBusinessAdviceTitle: '💡 My Business Advice',
    getBusinessAdviceBtn: 'Get Business Advice',
    aiAdvisorTitle: '💡 My Business Advice',
    aiAdvisorSubtitle: 'Smart AI guidance and business suggestions for your product.',
    aiBadge: 'AI Advisor',
    localAnalysisTitle: 'Business Financial Health',
    localAnalysisBadge: 'Instant Calculation',
    aiUnavailableNotice: 'AI advice is currently offline. Financial analysis is active.',
    askGeminiBtn: 'Get Business Advice',
    retryAiBtn: 'Get New Advice',
    generatingAdvice: 'Analyzing business metrics...',
    healthVerdictTitle: 'Business Health',
    healthStrong: 'Excellent Profit — Healthy margins',
    healthModerate: 'Good Profit — Steady earnings',
    healthThin: 'Low Profit — Requires high sales volume',
    healthLoss: 'Loss — Selling price is below cost',
    healthBreakEven: 'Break-Even — No profit, no loss',
    milestonesTitle: 'Pieces to sell for target profit goals',
    targetUnits: 'pieces',
    revenueRequired: 'Total sales needed:',
    optimizationTitle: 'Profit Boosters',
    priceBumpTip: 'A 5% price increase adds',
    costReductionTip: 'A 5% cost reduction adds',
    aiDisclaimer: 'Financial metrics calculated automatically. Tap Get Business Advice for custom AI insights.',
    aiAdvisorSteps: [
      'Check your instant business health and profit summary',
      'See how many pieces you need to hit higher profit milestones',
      'Tap Get Business Advice for customized business suggestions',
    ],
    localSummaryProfit: 'You make {profitPerPiece} profit on every piece of {product}.',
    localSummaryLoss: 'You lose {lossPerPiece} on every piece of {product}. Consider increasing the price.',
    localSummaryBreakEven: '{product} is currently at break-even (₹0 profit per piece).',

    // History Log / My Products
    savedLogsTitle: 'Saved Products Catalog',
    myProductsTitle: 'My Products',
    totalSavedBadge: 'Saved',
    catalogSales: 'Catalog Sales',
    catalogCost: 'Catalog Cost',
    catalogProfit: 'Catalog Profit',
    catalogRoi: 'Average ROI',
    exportCsvBtn: 'Export CSV',
    clearHistoryBtn: 'Clear All',
    searchProductsPlaceholder: 'Search saved products...',
    noSearchMatch: 'No saved products match your search',
    noHistoryTitle: 'No Saved Products',
    noHistoryDesc: 'Click "Save Product" above to save products for future reference.',
    loadItemTitle: 'Load into calculator',
    deleteItemTitle: 'Delete item',
    fillCalculatorBtn: 'Fill Calculator',
    editProductBtn: 'Edit',
    deleteProductBtn: 'Delete',
    statusProfit: 'PROFIT',
    statusLoss: 'LOSS',
    statusBreakEven: 'BREAK EVEN',
    pcsLabel: 'pcs',
    pieceLabel: 'piece',
    profitLabelShort: 'Profit',
    lossLabelShort: 'Loss',
    totalSalesShort: 'Total Sales',
    rankingTabAll: 'All Products',
    rankingTabProfit: '🏆 Highest Profit',
    rankingTabRoi: '📈 Highest ROI',
    rankingTabSales: '💰 Highest Sales',
    rankBadge: 'Rank',
    topPerformerPodium: 'Catalog Top Performers',
    topProfitLabel: 'Top Profit Maker',
    topRoiLabel: 'Top ROI',
    topSalesLabel: 'Top Revenue',

    confirmDeleteTitle: 'Delete Product?',
    confirmDeleteDesc: 'Are you sure you want to delete this product from your saved catalog?',
    confirmClearTitle: 'Clear All Saved Products?',
    confirmClearDesc: 'This will remove all saved products. This action cannot be undone.',
    confirmYes: 'Yes, Delete',
    confirmClearYes: 'Yes, Clear All',
    cancelDialogBtn: 'Cancel',

    instantCalcTitle: 'Instant Calculations',
    instantCalcDesc: 'Automatically calculates total cost, total sales, net profit/loss, ROI & margin.',
    inrFormatTitle: 'Indian Rupee Formatting',
    inrFormatDesc: 'Formatted in standard Lakh & Crore Indian numbering system (₹) with precise accuracy.',
    offlineFastTitle: 'Offline & Fast',
    offlineFastDesc: 'Runs entirely in browser without login, saving history securely in local memory.',
    footerEngine: 'Powered by NOMAN',
    footerDesigned: 'Designed for Small Business Owners & Retailers (₹ INR)',
  },

  hi: {
    appTitle: 'प्रॉफिट कैलकुलेटर',
    appTitlePro: 'प्रो',
    appSubtitle: 'कुछ ही सेकंड में अपने व्यवसाय का मुनाफ़ा और मार्जिन निकालें',
    currencyBadge: '₹ भारतीय रुपया',
    langLabel: 'भाषा:',
    sampleDataBtn: 'नमूना डेटा',
    clearBtn: 'साफ़ करें',

    productDetailsTitle: 'उत्पाद विवरण',
    productDetailsSubtitle: 'प्रति नग लागत, विक्रय मूल्य और बेची गई मात्रा दर्ज करें',
    voiceLabel: 'आवाज़:',
    voiceListening: 'सुन रहे हैं...',
    voiceListeningPrompt: 'सुन रहे हैं... बोलिए',
    voiceStopBtn: 'रोकें',
    voiceUnsupported: 'इस ब्राउज़र में स्पीच रिकग्निशन समर्थित नहीं है। कृपया गूगल क्रोम का उपयोग करें।',
    productNameLabel: 'उत्पाद का नाम',
    productNamePlaceholder: 'उत्पाद का नाम दर्ज करें...',
    skuHelper: 'नाम या कोड',
    costPriceLabel: 'लागत मूल्य (₹)',
    costPricePlaceholder: '0.00',
    costPriceHint: 'प्रति नग ख़रीद या उत्पादन लागत',
    unitBadgeCost: 'लागत',
    sellingPriceLabel: 'विक्रय मूल्य (₹)',
    sellingPricePlaceholder: '0.00',
    sellingPriceHint: 'प्रति नग बिक्री मूल्य',
    unitBadgeSelling: 'बिक्री',
    quantityLabel: 'मात्रा (नग)',
    quantityPlaceholder: '0',
    quantityHint: 'कुल बेचे या निर्मित नग',
    qtyHelper: 'कुल संख्या',
    resetBtn: 'रीसेट',
    calculateBtn: 'मुनाफ़ा निकालें',
    calculateProfitBtn: 'मुनाफ़ा निकालें',
    updateProductBtn: 'अपडेट करें',
    cancelEditBtn: 'संपादन रद्द करें',
    editingProductBanner: 'उत्पाद संपादित कर रहे हैं:',

    errProductNameReq: 'उत्पाद का नाम आवश्यक है',
    errCostPriceReq: 'लागत मूल्य आवश्यक है',
    errCostPriceNeg: 'लागत मूल्य शून्य से कम नहीं हो सकता',
    errSellingPriceReq: 'विक्रय मूल्य आवश्यक है',
    errSellingPriceNeg: 'विक्रय मूल्य शून्य से कम नहीं हो सकता',
    errQuantityReq: 'मात्रा आवश्यक है',
    errQuantityMin: 'मात्रा कम से कम 1 होनी चाहिए',

    productPrefix: 'उत्पाद:',
    unnamedProduct: 'अनाम उत्पाद',
    shareBtn: 'शेयर करें',
    copiedMsg: 'विवरण क्लिपबोर्ड पर कॉपी हो गया!',
    printBtn: 'प्रिंट / PDF',
    businessReportTitle: 'व्यापार लाभ रिपोर्ट',
    downloadPdfBtn: 'PDF डाउनलोड करें',
    generatingPdf: 'PDF बन रहा है...',
    pdfDownloadedSuccess: '✓ PDF डाउनलोड हुआ',
    pdfGenError: 'PDF नहीं बन पाया। कृपया फिर से प्रयास करें।',
    pdfSaveReport: 'PDF सेव करें',
    openPrintDialogBtn: 'प्रिंट करें',
    printingStatus: 'प्रिंट हो रहा है...',
    previewReportTitle: 'PDF एवं प्रिंट पूर्वावलोकन',
    saveLogBtn: 'उत्पाद सेव करें',
    savedLogBtn: '✓ सेव हुआ',
    profitStatusTitle: 'मुनाफ़ा',
    profitStatusSubtitle: 'शुद्ध मुनाफ़ा',
    lossStatusTitle: 'नुक़सान',
    lossStatusSubtitle: 'कुल नुक़सान',
    breakEvenStatusTitle: 'नो प्रॉफिट नो लॉस',
    breakEvenStatusSubtitle: 'विक्रय मूल्य और लागत बराबर हैं (शून्य लाभ, शून्य नुक़सान)।',
    healthExcellentProfit: 'शानदार मुनाफ़ा',
    healthGoodProfit: 'अच्छा मुनाफ़ा',
    healthLowProfit: 'कम मुनाफ़ा',
    healthLossStatus: 'नुक़सान',
    healthBreakEvenStatus: 'नो प्रॉफिट नो लॉस',
    totalSalesLabel: 'कुल बिक्री',
    revenueBadge: 'बिक्री',
    totalCostLabel: 'कुल लागत',
    expensesBadge: 'लागत',
    netProfitLabel: 'कुल मुनाफ़ा',
    netLossLabel: 'कुल नुक़सान',
    surplusBadge: 'मुनाफ़ा',
    deficitBadge: 'नुक़सान',
    profitPerPieceLabel: 'प्रति नग मुनाफ़ा',
    lossPerPieceLabel: 'प्रति नग नुक़सान',
    roiLabel: 'मुनाफ़ा प्रतिशत (ROI)',
    marginLabel: 'सेल्स मार्जिन',
    roiShort: 'ROI',
    marginShort: 'मार्जिन',
    unitsTimes: 'नग ×',
    perUnit: 'नग',
    shareFooter: 'NOMAN • प्रॉफिट कैलकुलेटर प्रो (₹ INR) द्वारा गणना की गई',
    yourProfitHeading: 'आपका मुनाफ़ा',
    yourLossHeading: 'आपका नुक़सान',
    yourProfitPerPiece: 'मुनाफ़ा / नग',
    yourLossPerPiece: 'नुक़सान / नग',
    profitShareInSales: 'बिक्री में मुनाफ़े का हिस्सा',
    howItWorksBtn: 'कैसे काम करता है?',

    emptyTitle: 'कुछ ही सेकंड में अपने व्यवसाय का मुनाफ़ा निकालें',
    emptySubtitle: 'उत्पाद का नाम, प्रति नग लागत, बिक्री मूल्य और मात्रा दर्ज करें ताकि तुरंत कुल बिक्री, कुल लागत, शुद्ध लाभ/हानि, ROI और सेल्स मार्जिन देख सकें।',
    badgeSales: '💰 कुल बिक्री',
    badgeCost: '💸 कुल लागत',
    badgeProfitLoss: '📈 मुनाफ़ा / नुक़सान',
    badgeReturn: '📊 ROI',

    // Smart Business Insights
    smartInsightsTitle: 'स्मार्ट व्यापार विश्लेषण',
    smartInsightsSubtitle: 'व्यापार बढ़ाने और मुनाफ़ा बढ़ाने के त्वरित उपाय',
    moreToolsTitle: 'अधिक व्यापार टूल्स',
    moreToolsSubtitle: 'उन्नत सिमुलेटर, लक्ष्य निर्धारक और मूल्य तुलना टूल्स',
    fourToolsBadge: '4 टूल',
    profitBoostersTitle: 'मुनाफ़ा बढ़ाने के आसान तरीक़े',
    profitBoostersSubtitle: 'छोटे बदलाव जिनसे आपकी कमाई तुरंत बढ़ेगी',
    profitBoosterPriceUp: 'क़ीमत ₹1 बढ़ाएं',
    profitBoosterCostDown: 'लागत ₹1 कम करें',
    profitBoosterQtyUp: '{qty} नग और बेचें',
    extraProfitText: 'मुनाफ़ा',
    quickWinsBadge: 'आसान मुनाफ़ा बढ़ाने के तरीके',
    smallChangesMultiplyText: '{qty} {unit} में छोटे बदलाव से बड़ा असर!',

    // Target Profit
    targetProfitTitle: 'लक्ष्य मुनाफ़ा',
    targetProfitSubtitle: 'आप कितना कमाना चाहते हैं, जानें कितने नग बेचने होंगे',
    goalBadge: 'लक्ष्य',
    iWantToEarnLabel: 'मुझे कमाना है',
    youNeedToSellLabel: 'आपको {qty} नग बेचने होंगे।',
    desiredProfitLabel: 'मनचाहा कुल मुनाफ़ा (₹)',
    quickProfitPresets: 'त्वरित लक्ष्य:',
    requiredQuantity: 'आवश्यक बिक्री मात्रा',
    projectedRevenue: 'कुल बिक्री',
    projectedCost: 'कुल लागत',
    applyQtyBtn: 'यह मात्रा फॉर्म में लगाएं',
    qtyAppliedToast: 'मात्रा लागू हुई!',
    cannotReachProfitWarning: 'गणना नहीं हो सकती: प्रति नग मुनाफ़े के लिए बिक्री मूल्य लागत से अधिक होना चाहिए।',
    targetProfitSimpleExplain: '₹{profit} मुनाफ़े के लिए {qty} नग बेचने होंगे।',
    targetProfitSteps: [
      'अपना मनचाहा कुल मुनाफ़ा (₹) दर्ज करें',
      'ऐप प्रति नग मुनाफ़े के हिसाब से आवश्यक नग निकालेगा',
      '"यह मात्रा फॉर्म में लगाएं" दबाकर फॉर्म में सेट करें',
    ],

    // Find My Best Selling Price
    targetFinderTitle: 'सर्वोत्तम बिक्री मूल्य खोजें',
    targetFinderSubtitle: 'आप कितना मुनाफ़ा कमाना चाहते हैं, सही कीमत जानें।',
    findBestPriceTitle: 'सर्वोत्तम बिक्री मूल्य खोजें',
    assistantBadge: 'टूल',
    costLabel: 'लागत मूल्य (₹)',
    targetReturnLabel: 'मनचाहा मुनाफ़ा प्रतिशत (%)',
    quickMarginsLabel: 'त्वरित विकल्प:',
    suggestedSellingPrice: 'सुझाई गई बिक्री कीमत',
    projectedProfitPerUnit: 'प्रति नग मुनाफ़ा:',
    applyPriceBtn: 'यह बिक्री मूल्य लगाएं',
    appliedToast: 'कीमत लागू हुई!',
    targetPriceSimpleExplain: '₹{cost} की लागत पर {return}% मुनाफ़े के लिए ₹{price} में बेचें।',
    targetReturnSteps: [
      'अपनी प्रति नग लागत डालें',
      'अपना मनचाहा मुनाफ़ा प्रतिशत (%) चुनें',
      'ऐप अपने आप सही बिक्री कीमत बता देगा',
    ],

    // What-If Simulator
    whatIfTitle: 'यदि मैं क़ीमत बदलूँ तो क्या होगा?',
    whatIfSimpleTitle: 'यदि मैं क़ीमत बदलूँ तो क्या होगा?',
    whatIfSubtitle: 'कीमत, मात्रा या लागत बदलकर देखें कि मुनाफ़ा कितना बदलेगा।',
    simulatorBadge: 'सिम्युलेटर',
    currentScenario: 'वर्तमान',
    simulatedScenario: 'नई कीमत',
    differenceDelta: 'मुनाफ़े में अंतर (Δ)',
    adjustCost: 'लागत (₹)',
    adjustSelling: 'बिक्री मूल्य (₹)',
    adjustQuantity: 'मात्रा',
    applyScenarioBtn: 'कैलकुलेटर में लगाएं',
    scenarioAppliedToast: 'परिदृश्य लागू हुआ!',
    resetScenarioBtn: 'रीसेट',
    whatIfSteps: [
      'बटन (+5%, +10%) दबाकर या नई कीमत डालकर देखें',
      'देखें कि प्रति नग और कुल मुनाफ़ा कितना बदलता है',
      '"कैलकुलेटर में लगाएं" दबाकर लागू करें',
    ],

    // Compare Prices
    smartPricingTitle: 'क़ीमतों की तुलना',
    comparePricesSimpleTitle: 'क़ीमतों की तुलना',
    smartPricingSubtitle: 'अलग-अलग बिक्री मूल्यों पर होने वाला मुनाफ़ा एक साथ देखें।',
    pricingBadge: 'मूल्य निर्धारण',
    pricingDisclaimer: 'लागत के आधार पर अलग-अलग कीमतों पर प्रति नग मुनाफ़ा देखें।',
    currentPriceLabel: 'वर्तमान मूल्य',
    tierCompetitive: 'किफायती मूल्य',
    tierStandard: 'मानक मूल्य',
    tierHealthy: 'अच्छा मुनाफ़ा मूल्य',
    tierHigh: 'अधिक मार्जिन मूल्य',
    tierPremium: 'प्रीमियम मूल्य',
    tierLuxury: 'सुपर प्रीमियम मूल्य',
    useThisPrice: 'यह मूल्य चुनें',
    smartPricingSteps: [
      'लागत के अनुसार विभिन्न बिक्री मूल्य देखें',
      'हर कीमत पर प्रति नग मुनाफ़ा जांचें',
      'जो कीमत सही लगे, उसके नीचे "यह मूल्य चुनें" दबाएं',
    ],
    profitPerPieceText: 'प्रति नग मुनाफ़ा',

    // AI Business Advisor
    myBusinessAdviceTitle: '💡 मेरी व्यापारिक सलाह',
    getBusinessAdviceBtn: 'व्यापारिक सलाह प्राप्त करें',
    aiAdvisorTitle: '💡 मेरी व्यापारिक सलाह',
    aiAdvisorSubtitle: 'आपके उत्पाद के लिए स्मार्ट व्यावसायिक सुझाव।',
    aiBadge: 'AI सलाहकार',
    localAnalysisTitle: 'व्यवसाय वित्तीय स्थिति',
    localAnalysisBadge: 'तुरंत गणना',
    aiUnavailableNotice: 'AI सलाह अभी ऑफलाइन है। वित्तीय गणना सक्रिय है।',
    askGeminiBtn: 'व्यापारिक सलाह प्राप्त करें',
    retryAiBtn: 'नई सलाह प्राप्त करें',
    generatingAdvice: 'सलाह तैयार हो रही है...',
    healthVerdictTitle: 'व्यापारिक स्थिति',
    healthStrong: 'शानदार मुनाफ़ा — मजबूत मार्जिन',
    healthModerate: 'अच्छा मुनाफ़ा — स्थिर कमाई',
    healthThin: 'कम मुनाफ़ा — अधिक बिक्री की आवश्यकता',
    healthLoss: 'नुक़सान — विक्रय मूल्य लागत से कम है',
    healthBreakEven: 'नो प्रॉफिट नो लॉस — शून्य मुनाफ़ा',
    milestonesTitle: 'मुनाफ़ा लक्ष्यों के लिए आवश्यक बिक्री संख्या',
    targetUnits: 'नग',
    revenueRequired: 'आवश्यक कुल बिक्री:',
    optimizationTitle: 'मुनाफ़ा बढ़ाने के आसान सुझाव',
    priceBumpTip: '5% कीमत बढ़ाने से शुद्ध मुनाफ़ा बढ़ेगा',
    costReductionTip: '5% लागत कम करने से शुद्ध मुनाफ़ा बढ़ेगा',
    aiDisclaimer: 'वित्तीय विश्लेषण तुरंत तैयार किया जाता है। AI सलाह के लिए ऊपर दिए बटन पर टैप करें।',
    aiAdvisorSteps: [
      'अपने उत्पाद का वर्तमान व्यापार विश्लेषण और मुनाफ़ा देखें',
      'देखें कि ₹5,000 या ₹10,000 मुनाफ़े के लिए कितने नग बेचने होंगे',
      'अधिक सुझावों के लिए "व्यापारिक सलाह प्राप्त करें" पर टैप करें',
    ],
    localSummaryProfit: 'आपके {product} पर {profitPerPiece} प्रति नग मुनाफ़ा है।',
    localSummaryLoss: 'आपके {product} पर {lossPerPiece} प्रति नग नुक़सान हो रहा है। कृपया कीमत बढ़ाएं।',
    localSummaryBreakEven: '{product} पर अभी कोई मुनाफ़ा या नुक़सान नहीं है (₹0 प्रति नग)।',

    // History Log / My Products
    savedLogsTitle: 'सुरक्षित उत्पाद सूची',
    myProductsTitle: 'मेरे प्रोडक्ट्स',
    totalSavedBadge: 'सेव हैं',
    catalogSales: 'कैटलॉग कुल बिक्री',
    catalogCost: 'कैटलॉग कुल लागत',
    catalogProfit: 'कैटलॉग कुल मुनाफ़ा',
    catalogRoi: 'औसत ROI',
    exportCsvBtn: 'CSV एक्सपोर्ट',
    clearHistoryBtn: 'सब साफ़ करें',
    searchProductsPlaceholder: 'सुरक्षित उत्पाद खोजें...',
    noSearchMatch: 'खोजे गए नाम से कोई सुरक्षित उत्पाद नहीं मिला',
    noHistoryTitle: 'कोई सुरक्षित उत्पाद नहीं है',
    noHistoryDesc: 'भविष्य में देखने और तुलना करने के लिए ऊपर परिणाम कार्ड में "उत्पाद सेव करें" बटन दबाएं।',
    loadItemTitle: 'कैलकुलेटर में लोड करें',
    deleteItemTitle: 'हटाएं',
    fillCalculatorBtn: 'कैलकुलेटर भरें',
    editProductBtn: 'संपादित करें',
    deleteProductBtn: 'हटाएं',
    statusProfit: 'मुनाफ़ा',
    statusLoss: 'नुक़सान',
    statusBreakEven: 'सम-स्तर',
    pcsLabel: 'नग',
    pieceLabel: 'नग',
    profitLabelShort: 'मुनाफ़ा',
    lossLabelShort: 'नुक़सान',
    totalSalesShort: 'कुल बिक्री',
    rankingTabAll: 'सभी उत्पाद',
    rankingTabProfit: '🏆 सर्वाधिक मुनाफ़ा',
    rankingTabRoi: '📈 सर्वाधिक ROI',
    rankingTabSales: '💰 सर्वाधिक बिक्री',
    rankBadge: 'रैंक',
    topPerformerPodium: 'कैटलॉग के शीर्ष उत्पाद',
    topProfitLabel: 'शीर्ष मुनाफ़ा',
    topRoiLabel: 'शीर्ष ROI',
    topSalesLabel: 'शीर्ष बिक्री',

    confirmDeleteTitle: 'उत्पाद हटाएं?',
    confirmDeleteDesc: 'क्या आप वाकई इस उत्पाद को अपनी सूची से हटाना चाहते हैं?',
    confirmClearTitle: 'सभी सुरक्षित उत्पाद हटाएं?',
    confirmClearDesc: 'यह सभी सुरक्षित उत्पादों को हटा देगा। यह क्रिया पूर्ववत नहीं की जा सकती।',
    confirmYes: 'हाँ, हटाएं',
    confirmClearYes: 'हाँ, सब साफ़ करें',
    cancelDialogBtn: 'रद्द करें',

    instantCalcTitle: 'त्वरित गणना',
    instantCalcDesc: 'स्वचालित रूप से कुल लागत, कुल बिक्री, शुद्ध लाभ/हानि, ROI और मार्जिन निकालता है।',
    inrFormatTitle: 'भारतीय रुपया (₹) फ़ॉर्मैट',
    inrFormatDesc: 'सटीक दशमलव के साथ मानक लाख और करोड़ भारतीय संख्या प्रणाली में प्रदर्शित।',
    offlineFastTitle: 'ऑफ़लाइन और तेज़',
    offlineFastDesc: 'बिना लॉगिन सीधे ब्राउज़र में चलता है और हिस्ट्री को आपके डिवाइस में सुरक्षित रखता है।',
    footerEngine: 'Powered by NOMAN',
    footerDesigned: 'छोटे दुकानदारों और व्यापारियों के लिए (₹ INR)',
  },

  mr: {
    appTitle: 'प्रॉफिट कॅल्क्युलेटर',
    appTitlePro: 'प्रो',
    appSubtitle: 'काही सेकंदात तुमच्या व्यवसायाचा नफा आणि मार्जिन काढा',
    currencyBadge: '₹ भारतीय रुपया',
    langLabel: 'भाषा:',
    sampleDataBtn: 'नमुना डेटा',
    clearBtn: 'साफ करा',

    productDetailsTitle: 'उत्पादन तपशील',
    productDetailsSubtitle: 'प्रति नग खर्च, विक्री किंमत आणि संख्या प्रविष्ट करा',
    voiceLabel: 'आवाज:',
    voiceListening: 'ऐकत आहोत...',
    voiceListeningPrompt: 'ऐकत आहोत... बोला',
    voiceStopBtn: 'थांबवा',
    voiceUnsupported: 'या ब्राउझरमध्ये स्पीच रेकग्निशन समर्थित नाही. कृपया गुगल क्रोम वापरा.',
    productNameLabel: 'उत्पादनाचे नाव',
    productNamePlaceholder: 'उत्पादनाचे नाव प्रविष्ट करा...',
    skuHelper: 'नाव किंवा कोड',
    costPriceLabel: 'खरेदी किंमत (₹)',
    costPricePlaceholder: '0.00',
    costPriceHint: 'प्रति नग खरेदी किंवा उत्पादन खर्च',
    unitBadgeCost: 'खरेदी',
    sellingPriceLabel: 'विक्री किंमत (₹)',
    sellingPricePlaceholder: '0.00',
    sellingPriceHint: 'प्रति नग विक्री किंमत',
    unitBadgeSelling: 'विक्री',
    quantityLabel: 'संख्या (नग)',
    quantityPlaceholder: '0',
    quantityHint: 'एकूण विकलेले किंवा उत्पादित नग',
    qtyHelper: 'एकूण संख्या',
    resetBtn: 'रीसेट',
    calculateBtn: 'नफा काढा',
    calculateProfitBtn: 'नफा काढा',
    updateProductBtn: 'अपडेट करा',
    cancelEditBtn: 'संपादन रद्द करा',
    editingProductBanner: 'उत्पादन संपादित करत आहे:',

    errProductNameReq: 'उत्पादनाचे नाव आवश्यक आहे',
    errCostPriceReq: 'खरेदी किंमत आवश्यक आहे',
    errCostPriceNeg: 'खरेदी किंमत शून्यापेक्षा कमी नसावी',
    errSellingPriceReq: 'विक्री किंमत आवश्यक आहे',
    errSellingPriceNeg: 'विक्री किंमत शून्यापेक्षा कमी नसावी',
    errQuantityReq: 'संख्या आवश्यक आहे',
    errQuantityMin: 'किमान संख्या 1 असावी',

    productPrefix: 'उत्पादन:',
    unnamedProduct: 'निनावी उत्पादन',
    shareBtn: 'शेअर करा',
    copiedMsg: 'तपशील क्लिपबोर्डवर कॉपी झाला!',
    printBtn: 'प्रिंट / PDF',
    businessReportTitle: 'व्यापार नफा अहवाल',
    downloadPdfBtn: 'PDF डाउनलोड करा',
    generatingPdf: 'PDF तयार होत आहे...',
    pdfDownloadedSuccess: '✓ PDF डाउनलोड झाले',
    pdfGenError: 'PDF तयार होऊ शकले नाही. कृपया पुन्हा प्रयत्न करा.',
    pdfSaveReport: 'PDF सेव्ह करा',
    openPrintDialogBtn: 'प्रिंट करा',
    printingStatus: 'प्रिंट होत आहे...',
    previewReportTitle: 'PDF आणि प्रिंट पूर्वावलोकन',
    saveLogBtn: 'उत्पादन सेव्ह करा',
    savedLogBtn: '✓ सेव्ह झाले',
    profitStatusTitle: 'नफा',
    profitStatusSubtitle: 'निव्वळ नफा',
    lossStatusTitle: 'तोटा',
    lossStatusSubtitle: 'एकूण तोटा',
    breakEvenStatusTitle: 'ना नफा ना तोटा',
    breakEvenStatusSubtitle: 'विक्री किंमत आणि खरेदी खर्च समान आहेत (शून्य नफा, शून्य तोटा).',
    healthExcellentProfit: 'उत्कृष्ट नफा',
    healthGoodProfit: 'चांगला नफा',
    healthLowProfit: 'कमी नफा',
    healthLossStatus: 'तोटा',
    healthBreakEvenStatus: 'ना नफा ना तोटा',
    totalSalesLabel: 'एकूण विक्री',
    revenueBadge: 'विक्री',
    totalCostLabel: 'एकूण खर्च',
    expensesBadge: 'खर्च',
    netProfitLabel: 'एकूण नफा',
    netLossLabel: 'एकूण तोटा',
    surplusBadge: 'नफा',
    deficitBadge: 'तोटा',
    profitPerPieceLabel: 'प्रति नग नफा',
    lossPerPieceLabel: 'प्रति नग तोटा',
    roiLabel: 'नफा टक्केवारी (ROI)',
    marginLabel: 'विक्री मार्जिन',
    roiShort: 'ROI',
    marginShort: 'मार्जिन',
    unitsTimes: 'नग ×',
    perUnit: 'नग',
    shareFooter: 'NOMAN • प्रॉफिट कॅल्क्युलेटर प्रो (₹ INR) द्वारे हिशोब केला गेला',
    yourProfitHeading: 'तुमचा नफा',
    yourLossHeading: 'तुमचा तोटा',
    yourProfitPerPiece: 'नफा / नग',
    yourLossPerPiece: 'तोटा / नग',
    profitShareInSales: 'विक्रीतील नफ्याचा वाटा',
    howItWorksBtn: 'कसे कार्य करते?',

    emptyTitle: 'काही सेकंदात तुमच्या व्यवसायाचा नफा मिळवा',
    emptySubtitle: 'उत्पादनाचे नाव, प्रति नग खरेदी किंमत, विक्री किंमत आणि संख्या प्रविष्ट करा जेणेकरून एकूण विक्री, खर्च, नफा/तोटा, ROI आणि मार्जिन त्वरित पाहता येईल.',
    badgeSales: '💰 एकूण विक्री',
    badgeCost: '💸 एकूण खर्च',
    badgeProfitLoss: '📈 नफा / तोटा',
    badgeReturn: '📊 ROI',

    // Smart Business Insights
    smartInsightsTitle: 'स्मार्ट व्यवसाय विश्लेषण',
    smartInsightsSubtitle: 'व्यवसाय वाढवण्यासाठी आणि नफा वाढवण्यासाठी सोपे मार्ग',
    moreToolsTitle: 'अधिक व्यवसाय साधने',
    moreToolsSubtitle: 'प्रगत सिम्युलेटर, ध्येय शोधक आणि किंमत तुलना साधने',
    fourToolsBadge: '4 साधने',
    profitBoostersTitle: 'नफा वाढवण्याचे सोपे मार्ग',
    profitBoostersSubtitle: 'लहान बदल ज्यामुळे तुमची कमाई थेट वाढेल',
    profitBoosterPriceUp: 'किंमत ₹1 वाढवा',
    profitBoosterCostDown: 'खर्च ₹1 कमी करा',
    profitBoosterQtyUp: '{qty} नग जास्त विका',
    extraProfitText: 'नफा',
    quickWinsBadge: 'नफा वाढवण्याचे सोपे मार्ग',
    smallChangesMultiplyText: '{qty} {unit} मध्ये छोट्या बदलांमुळे मोठा फायदा!',

    // Target Profit
    targetProfitTitle: 'ध्येय नफा',
    targetProfitSubtitle: 'तुम्हाला किती कमवायचे आहे, जाणा किती नग विकावे लागतील',
    goalBadge: 'ध्येय',
    iWantToEarnLabel: 'मला कमवायचे आहे',
    youNeedToSellLabel: 'तुम्हाला {qty} नग विकावे लागतील.',
    desiredProfitLabel: 'अपेक्षित एकूण नफा (₹)',
    quickProfitPresets: 'त्वरित उद्दिष्टे:',
    requiredQuantity: 'आवश्यक विक्री संख्या',
    projectedRevenue: 'एकूण विक्री',
    projectedCost: 'एकूण खर्च',
    applyQtyBtn: 'ही संख्या फॉर्ममध्ये वापरा',
    qtyAppliedToast: 'संख्या लागू झाली!',
    cannotReachProfitWarning: 'हिशोब करता येत नाही: प्रति नग नफ्यासाठी विक्री किंमत खरेदी किमतीपेक्षा जास्त असावी.',
    targetProfitSimpleExplain: '₹{profit} नफ्यासाठी {qty} नग विकावे लागतील.',
    targetProfitSteps: [
      'तुम्हाला हवा असलेला एकूण नफा (₹) टाका',
      'अॅप प्रति नग नफ्यानुसार आवश्यक संख्या काढेल',
      '"ही संख्या फॉर्ममध्ये वापरा" दाबा',
    ],

    // Find My Best Selling Price
    targetFinderTitle: 'सर्वोत्तम विक्री किंमत शोधा',
    targetFinderSubtitle: 'तुम्हाला हवा तितका नफा मिळवण्यासाठी योग्य विक्री किंमत काढा.',
    findBestPriceTitle: 'सर्वोत्तम विक्री किंमत शोधा',
    assistantBadge: 'टूल',
    costLabel: 'खरेदी किंमत (₹)',
    targetReturnLabel: 'अपेक्षित नफा टक्केवारी (%)',
    quickMarginsLabel: 'त्वरित पर्याय:',
    suggestedSellingPrice: 'सुचवलेली विक्री किंमत',
    projectedProfitPerUnit: 'प्रति नग नफा:',
    applyPriceBtn: 'ही विक्री किंमत वापरा',
    appliedToast: 'किंमत लागू झाली!',
    targetPriceSimpleExplain: '₹{cost} खरेदीवर {return}% नफ्यासाठी ₹{price} मध्ये विका.',
    targetReturnSteps: [
      'तुमची प्रति नग खरेदी किंमत टाका',
      'अपेक्षित नफा टक्केवारी (%) निवडा',
      'अॅप योग्य विक्री किंमत आपोआप दाखवेल',
    ],

    // What-If Simulator
    whatIfTitle: 'मी किंमत बदलली तर काय होईल?',
    whatIfSimpleTitle: 'मी किंमत बदलली तर काय होईल?',
    whatIfSubtitle: 'किंमत, संख्या किंवा खर्च बदलून नफ्यात काय फरक पडतो ते त्वरित बघा.',
    simulatorBadge: 'सिम्युलेटर',
    currentScenario: 'सध्याचे',
    simulatedScenario: 'नवीन किंमत',
    differenceDelta: 'नफ्यातील फरक (Δ)',
    adjustCost: 'खर्च (₹)',
    adjustSelling: 'विक्री किंमत (₹)',
    adjustQuantity: 'संख्या',
    applyScenarioBtn: 'कॅल्क्युलेटरमध्ये वापरा',
    scenarioAppliedToast: 'आकडे लागू झाले!',
    resetScenarioBtn: 'रीसेट',
    whatIfSteps: [
      'बटन (+5%, +10%) दाबून किंवा नवीन किंमत टाकून बघा',
      'प्रति नग आणि एकूण नफ्यात किती फरक पडतो ते बघा',
      '"कॅल्क्युलेटरमध्ये वापरा" दाबा',
    ],

    // Compare Prices
    smartPricingTitle: 'किमतींची तुलना',
    comparePricesSimpleTitle: 'किमतींची तुलना',
    smartPricingSubtitle: 'वेगवेगळ्या किमतीला विकल्यास किती नफा होईल ते एकाच वेळी बघा.',
    pricingBadge: 'किंमत निर्धारण',
    pricingDisclaimer: 'खरेदी किमतीनुसार वेगवेगळ्या विक्री किमतींवर होणारा नफा बघा.',
    currentPriceLabel: 'सध्याची किंमत',
    tierCompetitive: 'किफायतशीर किंमत',
    tierStandard: 'सामान्य किंमत',
    tierHealthy: 'चांगला नफा किंमत',
    tierHigh: 'जास्त मार्जिन किंमत',
    tierPremium: 'प्रीमियम किंमत',
    tierLuxury: 'सुपर प्रीमियम किंमत',
    useThisPrice: 'ही किंमत वापरा',
    smartPricingSteps: [
      'खरेदी किमतीनुसार वेगवेगळ्या विक्री किमती बघा',
      'प्रत्येक किमतीवर प्रति नग होणारा नफा तपासा',
      'योग्य वाटणाऱ्या किमतीखाली "ही किंमत वापरा" दाबा',
    ],
    profitPerPieceText: 'प्रति नग नफा',

    // AI Business Advisor
    myBusinessAdviceTitle: '💡 माझा व्यावसायिक सल्ला',
    getBusinessAdviceBtn: 'व्यावसायिक सल्ला मिळवा',
    aiAdvisorTitle: '💡 माझा व्यावसायिक सल्ला',
    aiAdvisorSubtitle: 'तुमच्या उत्पादनासाठी स्मार्ट AI व्यावसायिक मार्गदर्शन.',
    aiBadge: 'AI सल्लागार',
    localAnalysisTitle: 'व्यवसाय आर्थिक स्थिती',
    localAnalysisBadge: 'त्वरित गणना',
    aiUnavailableNotice: 'AI सल्ला सध्या ऑफलाइन आहे. आर्थिक विश्लेषण चालू आहे.',
    askGeminiBtn: 'व्यावसायिक सल्ला मिळवा',
    retryAiBtn: 'नवीन सल्ला मिळवा',
    generatingAdvice: 'सल्ला तयार करत आहे...',
    healthVerdictTitle: 'व्यवसाय स्थिती',
    healthStrong: 'उत्कृष्ट नफा — उत्तम मार्जिन',
    healthModerate: 'चांगला नफा — स्थिर कमाई',
    healthThin: 'कमी नफा — जास्त नग विकावे लागतील',
    healthLoss: 'तोटा — विक्री किंमत खरेदी खर्चापेक्षा कमी आहे',
    healthBreakEven: 'ना नफा ना तोटा — शून्य नफा',
    milestonesTitle: 'नफा उद्दिष्टांसाठी आवश्यक विक्री संख्या',
    targetUnits: 'नग',
    revenueRequired: 'आवश्यक एकूण विक्री:',
    optimizationTitle: 'नफा वाढवण्याच्या सोप्या युक्त्या',
    priceBumpTip: '5% किंमत वाढवल्यास निव्वळ नफा वाढेल',
    costReductionTip: '5% खरेदी खर्च कमी केल्यास नफा वाढेल',
    aiDisclaimer: 'आर्थिक विश्लेषण तात्काळ तुमच्या डिव्हाइसवर होते. AI सल्ल्यासाठी वरील बटणावर टॅप करा.',
    aiAdvisorSteps: [
      'तुमच्या उत्पादनाचा व्यवसाय विश्लेषण आणि नफा स्तर बघा',
      '₹5,000 किंवा ₹10,000 नफ्यासाठी किती नग विकावे लागतील ते बघा',
      'अधिक माहितीसाठी "व्यावसायिक सल्ला मिळवा" वर टॅप करा',
    ],
    localSummaryProfit: 'तुमच्या {product} वर प्रति नग {profitPerPiece} नफा आहे.',
    localSummaryLoss: 'तुमच्या {product} वर प्रति नग {lossPerPiece} तोटा होत आहे. कृपया किंमत वाढवा.',
    localSummaryBreakEven: '{product} वर सध्या नफा किंवा तोटा नाही (प्रति नग ₹0).',

    // History Log / My Products
    savedLogsTitle: 'सेव्ह केलेली उत्पादने',
    myProductsTitle: 'माझे प्रॉडक्ट्स',
    totalSavedBadge: 'सेव्ह आहेत',
    catalogSales: 'कॅटलॉग एकूण विक्री',
    catalogCost: 'कॅटलॉग एकूण खर्च',
    catalogProfit: 'कॅटलॉग एकूण नफा',
    catalogRoi: 'सरासरी ROI',
    exportCsvBtn: 'CSV एक्सपोर्ट',
    clearHistoryBtn: 'सर्व साफ करा',
    searchProductsPlaceholder: 'सेव्ह केलेली उत्पादने शोधा...',
    noSearchMatch: 'शोधलेल्या नावाने कोणतेही उत्पादन सापडले नाही',
    noHistoryTitle: 'कोणतेही सेव्ह केलेले उत्पादन नाही',
    noHistoryDesc: 'पुढील संदर्भासाठी व तुलना करण्यासाठी वरील निकाल कार्डमधील "उत्पाद सेव्ह करा" बटन दाबा.',
    loadItemTitle: 'कॅल्क्युलेटरमध्ये लोड करा',
    deleteItemTitle: 'हटवा',
    fillCalculatorBtn: 'कॅल्क्युलेटर भरा',
    editProductBtn: 'संपादित करा',
    deleteProductBtn: 'हटवा',
    statusProfit: 'नफा',
    statusLoss: 'तोटा',
    statusBreakEven: 'ना नफा ना तोटा',
    pcsLabel: 'नग',
    pieceLabel: 'नग',
    profitLabelShort: 'नफा',
    lossLabelShort: 'तोटा',
    totalSalesShort: 'एकूण विक्री',
    rankingTabAll: 'सर्व उत्पादने',
    rankingTabProfit: '🏆 सर्वाधिक नफा',
    rankingTabRoi: '📈 सर्वाधिक ROI',
    rankingTabSales: '💰 सर्वाधिक विक्री',
    rankBadge: 'रँक',
    topPerformerPodium: 'कॅटलॉग मधील अव्वल उत्पादने',
    topProfitLabel: 'अव्वल नफा',
    topRoiLabel: 'अव्वल ROI',
    topSalesLabel: 'अव्वल विक्री',

    confirmDeleteTitle: 'उत्पादन हटवायचे?',
    confirmDeleteDesc: 'तुम्हाला खात्री आहे की तुम्ही हे उत्पादन सेव्ह केलेल्या यादीतून हटवू इच्छिता?',
    confirmClearTitle: 'सर्व सेव्ह केलेली उत्पादने हटवायची?',
    confirmClearDesc: 'हे सर्व सेव्ह केलेले उत्पादने हटवेल. ही क्रिया पूर्ववत करता येणार नाही.',
    confirmYes: 'होय, हटवा',
    confirmClearYes: 'होय, सर्व साफ करा',
    cancelDialogBtn: 'रद्द करा',

    instantCalcTitle: 'त्वरित हिशोब',
    instantCalcDesc: 'एकूण खर्च, विक्री महसूल, नफा/तोटा, ROI आणि मार्जिन टक्केवारी स्वयंचलितपणे मोजते.',
    inrFormatTitle: 'भारतीय रुपया (₹) फॉरमॅट',
    inrFormatDesc: 'अचूक दशांशासह लाख आणि कोटी भारतीय संख्या पद्धतीत मांडणी.',
    offlineFastTitle: 'ऑफलाइन आणि वेगवान',
    offlineFastDesc: 'लॉगिनशिवाय थेट ब्राउझरमध्ये चालते आणि डेटा तुमच्या डिव्हाइसमध्ये सुरक्षित राहतो.',
    footerEngine: 'Powered by NOMAN',
    footerDesigned: 'लहान दुकानदार आणि व्यापाऱ्यांसाठी (₹ INR)',
  },
};

export const translations = TRANSLATIONS;

