/*
 * Custom function used to generate the output of the theme variables; more about it can be found at https://getpublii.com/dev/theme-variables/
 */

var generateThemeVariables = function(params) {
   let output = '';

      output += ` 
         :root {
             --main-width:   ${params.mainWidth};
             --sidebar-width:  ${params.sidebarWidth};
             --home-credo-height: ${params.homeCredoHeight};
             --home-carousel-posts: ${params.homeCarouselPosts};
             --light-accent: ${params.lightAccent};
             --light-secondary: ${params.lightSecondary};
             --light-background: #ffffff;
             --light-text: #111111;
             --dark-accent: ${params.darkAccent};
             --dark-secondary: ${params.darkSecondary};
             --dark-background: ${params.graphiteBackground};
             --dark-text: #f7f7f7;
             --lottie-default-width: ${params.lottieDefaultWidth};
             --lottie-default-height: ${params.lottieDefaultHeight};
         }`;  

   return output;
}

module.exports = generateThemeVariables;