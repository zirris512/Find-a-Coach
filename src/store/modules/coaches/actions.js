export default {
   async registerCoach(context, payload) {
      const userId = context.rootGetters.userId;
      const coachData = {
         firstName: payload.first,
         lastName: payload.last,
         description: payload.desc,
         hourlyRate: payload.rate,
         areas: payload.areas,
      };

      const token = context.rootGetters.token;

      const response = await fetch(
         `https://vue-http-demo-aa95c.firebaseio.com/coaches/${userId}.json?auth=${token}`,
         {
            method: "PUT",
            body: JSON.stringify(coachData),
         }
      );

      if (!response.ok) {
         // error...
      }

      context.commit("registerCoach", {
         ...coachData,
         id: userId,
      });
   },
   async loadCoaches(context, payload) {
      if (!context.getters.shouldUpdate && !payload.forceRefresh) {
         return;
      }

      const response = await fetch(
         `https://vue-http-demo-aa95c.firebaseio.com/coaches.json`
      );

      const resData = await response.json();

      if (!response.ok) {
         const error = new Error(resData.message || "Failed to fetch!");
         throw error;
      }

      const coaches = [];

      for (const key in resData) {
         const coach = {
            id: key,
            firstName: resData[key].firstName,
            lastName: resData[key].lastName,
            description: resData[key].description,
            hourlyRate: resData[key].hourlyRate,
            areas: resData[key].areas,
         };
         coaches.push(coach);
      }

      context.commit("setCoaches", coaches);
      context.commit("setFetchTimestamp");
   },
};
