# User Flows (v0)

## 1) Register → Login
1. User visits login/register page
2. Registers account
3. Confirms email (TBD)
4. Logs in
5. Redirect to Feed

## 2) Reset Password
1. User clicks “Reset Password”
2. Receives email with reset link
3. Sets new password
4. Redirects to login

## 3) View Profile (context-driven)
### Viewing own profile (“My profile”)
- Show edit/settings controls
- Show private widgets where applicable

### Viewing another user’s profile
- Show follow/friend controls
- Hide owner-only controls

## 4) Create a Post
1. User opens composer on Feed (or profile)
2. Adds text and/or images
3. Submits
4. Post appears in Feed and author profile

## 5) Comment + Reply
1. User opens post
2. Adds comment
3. Optionally replies to a comment
4. Thread updates, notifications created

## 6) Propose Deletion (moderation)
1. User clicks “Propose Deletion”
2. Selects reason (Reason 1..4 / Other)
3. Optional clarification text
4. Proposal created; voting UI becomes visible

## 7) Vote on Deletion
1. Eligible user sees proposed deletion
2. Votes Yes/No
3. UI updates to “Voted” state
4. When window ends:
   - if threshold met → content removed
   - else → content remains

## 8) Create Business
1. User opens “Create Business”
2. Enters name (slug generated, de-duped)
3. Business profile created
4. User becomes business admin (role)

## 9) Post a Business Review
1. User navigates to a business page
2. Creates review (text + rating TBD)
3. Review appears:
   - on business page Reviews section
   - on user profile Reviews section
