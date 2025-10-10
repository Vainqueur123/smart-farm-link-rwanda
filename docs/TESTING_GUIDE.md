# Testing Guide for Recent Bug Fixes

## Quick Test Scenarios

### 🔍 Test 1: View Details Button

**Time Required**: 2 minutes

**Steps**:
1. Open browser and navigate to `http://localhost:3000`
2. Login as a buyer (or create a buyer account)
3. Navigate to Buyer Dashboard
4. Scroll to "Track Your Orders" section
5. Click "View Details" on any order
6. **Expected Result**: You should be redirected to `/orders/{orderId}` page showing:
   - Order timeline with status indicators
   - Delivery information
   - Order items list
   - Total amount
   - Action buttons (Contact Seller, etc.)

**Success Criteria**:
- ✅ Navigation occurs without errors
- ✅ Order tracking page loads
- ✅ Timeline displays correctly
- ✅ Console shows: "Navigating to order details: {orderId}"

**If It Fails**:
- Check browser console for errors
- Verify order ID exists in database
- Ensure you're logged in as a buyer
- Check network tab for failed API calls

---

### 💬 Test 2: Messaging System

**Time Required**: 3 minutes

**Steps**:
1. Login to the platform
2. Open the messaging widget (usually in dashboard)
3. Select any conversation
4. Type and send: "Test message 1"
5. Wait 2 seconds for status to update
6. Type and send: "Test message 2"
7. **Expected Result**: Both messages should be visible with status indicators
8. Switch to another conversation
9. Switch back to the original conversation
10. **Expected Result**: Both messages should still be there

**Success Criteria**:
- ✅ First message appears immediately after sending
- ✅ First message status changes: waiting → sent → delivered
- ✅ Second message appears without hiding first message
- ✅ Both messages persist after switching conversations
- ✅ Status indicators show correctly (clock → check → double check)

**Status Indicators**:
- 🕐 **Waiting**: Clock icon (message queued)
- ✓ **Sent**: Single green checkmark
- ✓✓ **Delivered**: Double green checkmark
- ✓✓ **Seen**: Double blue checkmark

**If It Fails**:
- Open browser console and check for errors
- Verify you're in a valid conversation
- Check if messages array is updating
- Look for state management issues

---

### 🗺️ Test 3: Account Creation (No Default District)

**Time Required**: 3 minutes

**Steps**:
1. Logout if currently logged in
2. Navigate to signup page
3. Click "Create Account" or "Sign Up"
4. Select "Farmer" as account type
5. Fill in:
   - Name: "Test Farmer"
   - Email: "testfarmer@example.com"
   - Phone: "0781234567"
   - Password: "Test123!"
6. Complete signup
7. Navigate to Profile Settings
8. Check the District field
9. **Expected Result**: District field should be empty (not "Kicukiro")
10. Repeat steps 1-9 but select "Buyer" as account type

**Success Criteria**:
- ✅ Farmer account: District field is empty
- ✅ Buyer account: District field is empty
- ✅ No "Kicukiro" appears as default
- ✅ User can select any district from dropdown

**If It Fails**:
- Check `lib/auth-context.tsx` for hardcoded districts
- Verify the signup flow is using the updated code
- Clear browser cache and try again
- Check if profile data is being cached

---

## Comprehensive Test Suite

### Test Suite 1: Order Management Flow

**Scenario**: Complete order lifecycle with tracking

1. **Create Order**
   - Login as buyer
   - Go to marketplace
   - Add product to cart
   - Proceed to checkout
   - Fill delivery information
   - Place order
   - **Verify**: Order appears in dashboard

2. **View Order Details**
   - In buyer dashboard, locate the new order
   - Click "View Details"
   - **Verify**: Order tracking page loads
   - **Verify**: Status shows "Pending"

3. **Track Order Progress**
   - As admin/seller, update order status to "Processing"
   - Refresh buyer's order tracking page
   - **Verify**: Timeline updates to show "Processing"
   - Update status to "Shipped"
   - **Verify**: Timeline shows "Shipped" with truck icon
   - Update status to "Delivered"
   - **Verify**: Timeline shows "Delivered" with checkmark

4. **Order Actions**
   - Click "Contact Seller" button
   - **Verify**: Messaging widget opens
   - Click "Leave Review" (if delivered)
   - **Verify**: Review form appears

---

### Test Suite 2: Messaging Flow

**Scenario**: Complete conversation with status tracking

1. **Start Conversation**
   - Login as buyer
   - Open messaging widget
   - Select a farmer/seller
   - Send: "Hello, I'm interested in your products"
   - **Verify**: Message appears with waiting status (clock icon)
   - Wait 1 second
   - **Verify**: Status changes to sent (single checkmark)
   - Wait 2 seconds
   - **Verify**: Status changes to delivered (double checkmark)

2. **Continue Conversation**
   - Send: "What are your prices?"
   - **Verify**: Previous message still visible
   - **Verify**: New message appears below
   - Send: "Do you deliver to Kigali?"
   - **Verify**: All three messages visible
   - **Verify**: All have correct status indicators

3. **Switch Conversations**
   - Click on another conversation
   - **Verify**: Different messages load
   - Click back to original conversation
   - **Verify**: All three messages still there
   - **Verify**: Status indicators preserved

4. **Receive Messages**
   - Login as the seller (in another browser/incognito)
   - Open messaging widget
   - **Verify**: Unread count shows on buyer's conversation
   - Click on buyer's conversation
   - **Verify**: Messages marked as "seen" (blue checkmarks)

---

### Test Suite 3: Account Creation Flow

**Scenario**: Create accounts without default districts

1. **Farmer Account**
   - Logout completely
   - Go to signup page
   - Select "Farmer"
   - Enter details:
     - Name: "Jean Baptiste"
     - Email: "jean.test@example.com"
     - Phone: "0788888888"
     - Password: "Farmer123!"
   - Submit registration
   - **Verify**: Account created successfully
   - Go to Profile/Settings
   - **Verify**: District field is empty
   - Select "Gasabo" from dropdown
   - Save profile
   - **Verify**: District saved as "Gasabo"

2. **Buyer Account**
   - Logout
   - Go to signup page
   - Select "Buyer"
   - Enter details:
     - Name: "Marie Claire"
     - Email: "marie.test@example.com"
     - Phone: "0799999999"
     - Password: "Buyer123!"
   - Submit registration
   - **Verify**: Account created successfully
   - Go to Profile/Settings
   - **Verify**: District field is empty
   - Select "Nyarugenge" from dropdown
   - Save profile
   - **Verify**: District saved as "Nyarugenge"

3. **Profile Completion**
   - With empty district, try to complete profile
   - **Verify**: System prompts to select district
   - Select a district
   - Complete other required fields
   - Save
   - **Verify**: Profile marked as complete

---

## Automated Testing Commands

If you have test scripts set up, run:

```bash
# Run all tests
npm test

# Run specific test suites
npm test -- buyer-dashboard
npm test -- messaging-system
npm test -- auth-flow

# Run with coverage
npm test -- --coverage
```

---

## Browser Console Checks

### Expected Console Logs

**When clicking View Details**:
```
Navigating to order details: order_1234567890
```

**When sending a message**:
```
Message sent: msg-1234567890
Message status updated: sent
Message status updated: delivered
```

**When creating account**:
```
User signed up as farmer/buyer
Profile created with empty district
```

### Error Messages to Watch For

**❌ Bad**:
```
Error: Order not found
Error: Failed to fetch order
Error: Cannot read property 'id' of undefined
TypeError: router.push is not a function
```

**✅ Good**:
```
Order loaded successfully
Navigation successful
Message sent successfully
Profile created successfully
```

---

## Performance Checks

### Page Load Times

- **Buyer Dashboard**: Should load in < 2 seconds
- **Order Tracking Page**: Should load in < 1.5 seconds
- **Messaging Widget**: Should open in < 500ms
- **Message Send**: Should appear in < 100ms

### Network Requests

Monitor network tab for:
- Failed requests (should be 0)
- Slow requests (> 3 seconds)
- Duplicate requests
- Unnecessary requests

---

## Mobile Testing

Test on mobile devices or responsive mode:

1. **View Details Button**
   - Should be tappable (not too small)
   - Navigation should work on mobile
   - Order tracking page should be responsive

2. **Messaging**
   - Keyboard should not cover input
   - Messages should scroll properly
   - Status indicators should be visible

3. **Account Creation**
   - District dropdown should work on mobile
   - Form should be easy to fill
   - Validation should work

---

## Regression Testing

Ensure these still work after the fixes:

- [ ] Login/Logout functionality
- [ ] Product browsing
- [ ] Add to cart
- [ ] Checkout process
- [ ] Payment methods
- [ ] Profile editing
- [ ] Search functionality
- [ ] Filters and sorting
- [ ] Notifications
- [ ] Language switching

---

## Troubleshooting Common Issues

### Issue: View Details button does nothing

**Solutions**:
1. Check browser console for errors
2. Verify order ID is valid
3. Clear browser cache
4. Check if router is properly initialized
5. Verify user is authenticated

### Issue: Messages disappear after sending

**Solutions**:
1. Check if `allMessages` state is updating
2. Verify `selectedConversation` is set
3. Check browser console for state errors
4. Clear local storage and reload
5. Verify message ID is unique

### Issue: District still shows "Kicukiro"

**Solutions**:
1. Clear browser cache completely
2. Delete account and create new one
3. Check if old profile data is cached
4. Verify code changes are deployed
5. Check database for old default values

---

## Test Data

### Sample Order IDs
- `order_1234567890`
- `order_9876543210`

### Sample User Credentials
- **Buyer**: buyer@example.com / password123
- **Farmer**: farmer@example.com / password123
- **Admin**: admin@smartfarm.rw / admin123

### Sample Districts
- Gasabo
- Kicukiro
- Nyarugenge
- Musanze
- Huye

---

## Reporting Issues

If you find a bug:

1. **Document**:
   - What you were doing
   - What you expected
   - What actually happened
   - Browser and version
   - Screenshots/videos

2. **Console Logs**:
   - Copy any error messages
   - Include network requests
   - Note any warnings

3. **Steps to Reproduce**:
   - List exact steps
   - Include test data used
   - Note any special conditions

4. **Submit**:
   - Create GitHub issue
   - Tag with appropriate labels
   - Assign to developer
   - Include all documentation

---

## Success Metrics

After testing, verify:

- ✅ 100% of View Details clicks navigate successfully
- ✅ 100% of messages persist after sending
- ✅ 0% of new accounts have default "Kicukiro"
- ✅ 0 console errors during normal usage
- ✅ < 2 second page load times
- ✅ All regression tests pass

---

## Next Steps

After confirming all tests pass:

1. Deploy to staging environment
2. Run full test suite on staging
3. Get user acceptance testing
4. Deploy to production
5. Monitor for issues
6. Collect user feedback

---

## Contact

For questions about testing:
- Development Team: dev@smartfarm.rw
- QA Team: qa@smartfarm.rw
- Documentation: docs@smartfarm.rw
