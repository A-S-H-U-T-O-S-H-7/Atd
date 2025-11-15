 const calculateAndSetCharges = () => {
    if (!collectionData || !formData.collectionDate) return;

    const approvedAmount = parseFloat(collectionData.approved_amount);
    const dwCollection = parseFloat(collectionData.dw_collection);
    const dueDate = new Date(collectionData.duedate);
    const gracePeriod = parseInt(collectionData.grace_period);
    const collectionDate = new Date(formData.collectionDate);
    const lastCollectionDate = collectionData.last_collection_date 
      ? new Date(collectionData.last_collection_date) 
      : null;
    const totalPenaltyPaid = parseFloat(collectionData.total_penalty_paid || 0);
    const hasOverduePayment = collectionData.has_overdue_payment === 1;

    // Calculate grace period end date
    const gracePeriodEnd = new Date(dueDate);
    gracePeriodEnd.setDate(gracePeriodEnd.getDate() + gracePeriod);

    // Check if payment is within grace period
    const isWithinGracePeriod = collectionDate <= gracePeriodEnd;

    // SCENARIO 1 & 3: Payment within grace period (on-time)
    if (isWithinGracePeriod && !hasOverduePayment) {
      setFormData(prev => ({
        ...prev,
        normalInterest: "0",
        penaltyInput: "0",
        penalInterest: "0"
      }));
      setPenaltyChecked(false);
      return;
    }

    // Determine if this is first late payment or subsequent payment
    const isFirstLatePayment = !lastCollectionDate;
    
    let diffDays;
    
    // SCENARIO 2 & 4: First late payment - calculate from due date
    if (isFirstLatePayment) {
      diffDays = Math.floor((collectionDate - dueDate) / (1000 * 60 * 60 * 24));
    } 
    // SCENARIO 5: Subsequent late payments - calculate from last collection date
    else {
      diffDays = Math.floor((collectionDate - lastCollectionDate) / (1000 * 60 * 60 * 24));
    }

    // Ensure positive days
    diffDays = Math.max(0, diffDays);

    // Calculate normal interest: ((approved_amount * 0.067) / 100) * diffdays
    const normalInterest = ((approvedAmount * 0.067) / 100) * diffDays;
    
    // Calculate penal interest: ((approved_amount * 0.6) / 100) * diffdays
    const penalInterestBase = ((approvedAmount * 0.6) / 100) * diffDays;
    
    // Calculate penal GST: 18% of penal interest
    const penalGst = penalInterestBase * 0.18;
    
    // Total penal interest including GST
    const penalInterestTotal = penalInterestBase + penalGst;
    
    // Penalty logic
    let penalty = 0;
    if (isFirstLatePayment) {
      // First late payment: always charge 500
      penalty = 500;
    } else {
      // Subsequent payments: only if customer hasn't paid 500 before
      penalty = totalPenaltyPaid >= 500 ? 0 : 500;
    }

    // Update form data with calculated values
    setFormData(prev => ({
      ...prev,
      normalInterest: normalInterest.toFixed(2),
      penaltyInput: penalty.toString(),
      penalInterest: penalInterestTotal.toFixed(2)
    }));
    
    // Update penalty checkbox state
    setPenaltyChecked(penalty === 500);
  };
 

  if (!isOpen) return null;

  // Use API data
  const sanctionAmount = collectionData?.approved_amount || "0";
  const processFee = collectionData?.process_fee || "0";
  const processFeePrincipal = parseFloat(processFee) - parseFloat(collectionData?.gst || 0);
  const processFeeGST = collectionData?.gst || "0";
  const processFeeDetail = `(Principal: ${processFeePrincipal.toLocaleString('en-IN')} + GST: ${parseFloat(processFeeGST).toLocaleString('en-IN')})`;
  const disburseDate = collectionData?.disburse_date || "";
  const transactionDate = collectionData?.transaction_date || "";
  const dueDate = collectionData?.duedate || "";
  const interest = collectionData?.roi ? `${collectionData.roi}%` : "";
  const dueAmount = collectionData?.dw_collection || "";
  
  // Calculate total due amount
  const calculateTotalDue = () => {
    const base = parseFloat(collectionData?.dw_collection || 0);
    const normalInt = parseFloat(formData.normalInterest || 0);
    const penalty = parseFloat(formData.penaltyInput || 0);
    const penalInt = parseFloat(formData.penalInterest || 0);
    const bounce = parseFloat(formData.bounceCharge || 0);
    return (base + normalInt + penalty + penalInt + bounce).toFixed(2);
  };
  
  const totalDueAmount = calculateTotalDue();
  const amtDisbursedFrom = collectionData?.bank_name || "";

  // Calculate penalty details for display
  const penaltyAmount = formData.penaltyInput ? parseFloat(formData.penaltyInput) : 0;
  const penaltyPrincipal = penaltyAmount > 0 ? Math.round(penaltyAmount / 1.18) : 0;
  const penaltyGST = penaltyAmount > 0 ? penaltyAmount - penaltyPrincipal : 0;
  const penaltyDetail = penaltyAmount > 0 ? `(Principal: ${penaltyPrincipal.toLocaleString('en-IN')} + GST: ${penaltyGST.toLocaleString('en-IN')})` : "";

  // Calculate penal interest details for display
  const penalInterestAmount = formData.penalInterest ? parseFloat(formData.penalInterest) : 0;
  const penalInterestPrincipal = penalInterestAmount > 0 ? Math.round(penalInterestAmount / 1.18) : 0;
  const penalInterestGST = penalInterestAmount > 0 ? penalInterestAmount - penalInterestPrincipal : 0;
  const penalInterestDetail = penalInterestAmount > 0 ? `(Penal Int: ${penalInterestPrincipal.toLocaleString('en-IN')} + GST: ${penalInterestGST.toLocaleString('en-IN')})` : "";
