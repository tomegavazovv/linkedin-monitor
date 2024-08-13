# Backend of Dexra.co, built with NodeJS and MongoDB.
- This doesn't work on its own, you need to downlaod the chrome extension "Dexra" too.

One of the ways of breaking the cold outreach on LinkedIn, is engaging with their posts before sending them a message. 
But LinkedIn doesn't provide a way to monitor selected users, so those who have their lists of leads need to manually check each profile, check for new posts, engage. 
So I built this tool with the purpose of collecting all the posts from selected users in one place. So you can view all their new posts with one click.

We started with one mechanism, then switched to simpler one. 
I will describe them here briefly:

# Mechanism 1:
- When a user adds a new Linkedin profile into a list, this is what happens:
    - Take their cookie using the extension
    - Visit the needed LinkedIn profile
    - Open their "Reactions" page
    - Take the urns of the first 20 reactions
    - Send them to the backend
    - Filter out the bad urns using background worker
    - Save the "good" urns
- Why do we need these urns of their reactions?
    - If you have a urn of a reaction from a profile, without being logged in, you can view the most recent 10 posts of that LinkedIn profile.
- So when a user wants to check for new posts from a certain list, this is what happens:
    - Construct the needed urls
    - Using datacenter proxies, visit each url
    - Scrape the posts
    - Check for new posts
    - Return the new posts
    
# Mechanism 2:
- Talking with one of our prospects, we found out that there is a much simpler way to do this whole thing
- It has to do with the LinkedIn search functionality, so essentially we just made an enhancement to this LinkedIn's search functionality.

