Project description:
- Bombora Surf App
  * Bombora: An aboriginal term for a wave that breaks over a shallow reef, located beyond the normal lineup and often some distance from the shore
- Initial plan:
  * overlay surf forecast (magic seaweed api) data onto google maps api
  * connect create user generated data and pin it to specific locations on google map
- Technical challenges:
  * accessing expected surf forecast data, magic seaweed was thought to be open source, but was not
  * second approach was to access data through openweather.org
  * integration with google maps api was very challenging, and documentation turned out to be very dated &/or inaccurate (4-6 hours)
- Final delivery:
  * end solution was to use google maps, and embedded forecast in iframe to have all the components working... even if independently
- New learning:
  * combing through google maps documentation -
  * integrating 2 APIs is a significant challenge
- Next steps:
  * continue working with Firebase to create a user login flow
  * public and private posts
  * dynamically generated markers based on user submission
