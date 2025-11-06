function handleResponse(res) {
            if (typeof res != 'undefined' && typeof res.paymentMethod != 'undefined' && typeof res.paymentMethod.paymentTransaction != 'undefined' && typeof res.paymentMethod.paymentTransaction.statusCode != 'undefined' && res.paymentMethod.paymentTransaction.statusCode == '0300') {
                // success block
            } else if (typeof res != 'undefined' && typeof res.paymentMethod != 'undefined' && typeof res.paymentMethod.paymentTransaction != 'undefined' && typeof res.paymentMethod.paymentTransaction.statusCode != 'undefined' && res.paymentMethod.paymentTransaction.statusCode == '0398') {
                // initiated block
            } else {
                // error block
            }
        };



         
                var configJson = {
                    'tarCall': false,
                    'features': {
                        'showPGResponseMsg': true,
                        'enableAbortResponse': true,
                        'enableNewWindowFlow': false, 
                        'enableExpressPay': true,
                        'payDetailsAtMerchantEnd': true,
                        'siDetailsAtMerchantEnd': true,
                        'enableSI': true
                    },

                    'consumerData': {
                        'deviceId': 'WEBSH2', 
                        'token': token,
                        'returnUrl': 'https://api.atdmoney.in/api/user/enach/report',
                        'responseHandler': handleResponse,
                        'paymentMode': paymentMode,
                        'merchantLogoUrl': 'https://atdmoney.com/images/logo.png', 
                        'merchantId': 'L815953',
                        'currency': 'INR',
                        'consumerId': loan_no, 
                        'consumerMobileNo': subscription_phone,
                        'consumerEmailId': subscription_email,
                        'txnId': subscription_id, 
                        'mandateSubType': [enchSubtype],
                        'items': [{
                            'itemId': 'FIRST',
                            'amount': '2',
                            'comAmt': '0'
                        }],

                        'customStyle': {
                            'PRIMARY_COLOR_CODE': '#00A651', 
                            'SECONDARY_COLOR_CODE': '#FFFFFF', 
                            'BUTTON_COLOR_CODE_1': '#AB2327',
                            'BUTTON_COLOR_CODE_2': '#FFFFFF' 
                        },
                        'bankCode': enachbank,
                        'accountNo': account_no, 
                        'accountHolderName': subscription_name,
                        'accountType': 'Saving', 
                        'ifscCode': ifsc_code, 
                        'debitStartDate': debit_start_date,
                        'debitEndDate': max_end_date,
                        'maxAmount': amount,
                        'amountType': 'M',
                        'frequency': frequency 
                    }
                };

                $.pnCheckout(configJson);
                if (configJson.features.enableNewWindowFlow) {
                    pnCheckoutShared.openNewWindow();
                }