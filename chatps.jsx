New JObject(
  New JProperty("parcels", New JArray(
          (From row In dtOutput.AsEnumerable()
              Select New JObject(
                  New JProperty("parcelNumber", row("ParcelNumber")),
                  New JProperty("taxYear", row("TaxYear")),
                  New JProperty("agencies",
                      If((String.IsNullOrEmpty(row("FHAmount").ToString) AndAlso String.IsNullOrEmpty(row("SHAmount").ToString)) OrElse (row("SHAmount").ToString().Equals("0.00") AndAlso row("FHAmount").ToString().Equals("0.00")),
                          New JArray(
                              New JObject(
                                  New JProperty("installmentAmount1", row("Amount").ToString),
                                  New JProperty("installmentDueDate1", row("DueDate").ToString),
                                  New JProperty("installmentPaidAmount1", 
                                      If((String.IsNullOrEmpty(row("Balance").ToString) OrElse String.IsNullOrEmpty(row("Amount").ToString)),
                                          "",
                                          If(CDbl(row("Balance").ToString) > CDbl(row("Amount").ToString), 
                                              "0.00",  If(CDbl(row("Balance").ToString) = 0, Math.Round(Math.Abs( CDbl(row("Amount").ToString)),2).ToString , 
                      If(CDbl(row("Balance").ToString) < CDbl(row("Amount").ToString),PaidAmount,"0.00")
                      )
                      )
                                      )
                                  ),
                                  New JProperty("installmentUnPaidAmount1", 
                If(row("TaxYear").ToString = CurrentYear.ToString, Math.Round(Math.Abs( CDbl(row("Balance").ToString)),2).ToString,"")),
                                  New JProperty("delinquencies",
                                      New JArray(
                                          If(row("TaxYear").ToString = CurrentYear.ToString, New JObject(), If(String.IsNullOrEmpty(row("Delinquent").ToString),
                                              New JObject(),
                                              New JObject(
                                                  New JProperty("payoffAmount",
                                                      If(String.IsNullOrEmpty(row("Balance").ToString) OrElse String.IsNullOrEmpty(row("Delinquent").ToString),
                                                          "",
                                                          Math.Round(Math.Abs( CDbl(row("Balance").ToString)),2).ToString
                                                      )
                                                  ),
                                                  New JProperty("taxYear", row("TaxYear"))
                                              )
                                          ) )
                                      )
                                  )                                  
                              )
                          ),
                          New JArray(
                              New JObject(
                                  New JProperty("installmentAmount1", row("FHAmount").ToString),
                                  New JProperty("installmentDueDate1", row("FHDueDate").ToString),
                                  New JProperty("installmentPaidAmount1", 
                                      If(String.IsNullOrEmpty(row("FHAmount").ToString) OrElse String.IsNullOrEmpty(row("FHBalance").ToString),
                                          "",
                                          If(CDbl(row("FHBalance").ToString) > CDbl(row("FHAmount").ToString), 
                                              "0.00",
                                             Math.Round(Math.Abs(CDbl(row("FHAmount").ToString) - CDbl(row("FHBalance").ToString)), 2).ToString
                                          )
                                      )
                                  ),
                                  New JProperty("installmentAmount2", row("SHAmount").ToString),
                                  New JProperty("installmentDueDate2", row("SHDueDate").ToString),
                                  New JProperty("installmentPaidAmount2", 
                                      If(String.IsNullOrEmpty(row("SHAmount").ToString) OrElse String.IsNullOrEmpty(row("SHBalance").ToString),
                                          "",
                                          If(CDbl(row("SHBalance").ToString) > CDbl(row("SHAmount").ToString), 
                                              "0.00",
                      Math.Round(Math.Abs(CDbl(row("SHAmount").ToString) - CDbl(row("SHBalance").ToString)), 2).ToString   
                                          )
                                      )
                                  ),
                                 New JProperty("installmentUnPaidAmount1", 
                If(row("TaxYear").ToString  = CurrentYear.ToString, Math.Round(Math.Abs( CDbl(row("FHBalance").ToString)),2).ToString,"")
                ),
                                  New JProperty("installmentUnPaidAmount2", 
                If(row("TaxYear").ToString  = CurrentYear.ToString, Math.Round(Math.Abs( CDbl(row("SHBalance").ToString)),2).ToString,"")
                ),
                                  New JProperty("delinquencies",
                                      New JArray(
                                          If(row("TaxYear").ToString  = CurrentYear.ToString, New JObject(), 
                                          If(String.IsNullOrEmpty(row("FHDelinquent").ToString),
                                              New JObject(),
                                              New JObject(
                                                  New JProperty("payoffAmount",
                                                      If(String.IsNullOrEmpty(row("FHBalance").ToString) OrElse String.IsNullOrEmpty(row("FHDelinquent").ToString),
                                                          "",
                                                          Math.Round(Math.Abs( CDbl(row("FHBalance").ToString)),2).ToString
                                                      )
                                                  ),
                                                  New JProperty("taxYear", row("TaxYear"))
                                              )
                                          )),
                                          If(row("TaxYear").ToString  = CurrentYear.ToString, New JObject(), 
                                          If(String.IsNullOrEmpty(row("SHDelinquent").ToString),
                                              New JObject(),
                                              New JObject(
                                                  New JProperty("payoffAmount",
                                                      If(String.IsNullOrEmpty(row("SHBalance").ToString) OrElse String.IsNullOrEmpty(row("SHDelinquent").ToString),
                                                          "",
                                                          Math.Round(Math.Abs( CDbl(row("SHBalance").ToString)),2).ToString
                                                      )
                                                  ),
                                                  New JProperty("taxYear", row("TaxYear"))
                                              )
                                          ) )
                                      )
                                  )
                              )
                          )
                      )
                  )
          )).ToList()
      )    
  )
)