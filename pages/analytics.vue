<template>
  <div>

<div class="mt-5">
      <div class="d-flex flex-row">

          <v-text-field
            :disabled="loadclassification || !searchactiveStatus || searchStat || versionSearch == '' && searchactivetype == 'version'"
            v-model="search"
            rounded
            filled
            :loading="loadclassification"
            label="Search Tweet"
            prepend-inner-icon="mdi-magnify"
            @keyup.enter="initiate_search"
            class="kq"
          ></v-text-field>

          <div class="d-flex flex-row ml-1">

              <v-select
                v-model="versionSearch"
                v-if="searchactiveStatus && searchactivetype == 'version'"
                :items="userVersion"
                :loading="versionload"
                label="Select version"
                filled
                rounded
                :disabled="searchStat"
                prepend-inner-icon="mdi-database-search"
                class="qq"
              >
              </v-select>
              <v-select
                v-model="searchactivetype"
                :items="searchtype"
                label="Select Type"
                filled
                rounded
                class="aa"
                v-if="!searchactiveStatus"
              ></v-select>

              <v-btn
                fab
                depressed
                class="ml-1"
                @click="searchactiveStatus = true"
                v-if="searchactivetype != '' && !searchactiveStatus"
              >
                <v-icon>mdi-check</v-icon>
              </v-btn>
              
          </div>

          <v-btn
            fab
            depressed
            v-if="searchStat"
            @click="Resets"
            class="ml-2"
          >
            <v-icon>mdi-refresh</v-icon>
          </v-btn>


           
      </div>
     
     <div class="pa-3" v-if="searchactiveStatus">
        Searching in: {{searchactivetype}}
     </div>
      
</div>
            


<div v-if="classification.length != 0">
    <v-row no-gutters>
      <v-col
        class="pa-2"
      >

        <v-card
          color="primary"
          elevation="2"
          width="300px"
        >
        <v-card-title class="caption white--text">Total Classified</v-card-title>
          <v-card-text class="text-center headline white--text p-15">
            {{classification.analytics.TWEET_LENGTH}}
          </v-card-text>
        </v-card>
        
      </v-col>
      
      <v-col
        class="pa-2"
      >

        <v-card
          elevation="2"
          color="indigo darken-4"
        >
          <v-card-title class="caption white--text">
            <v-icon class="mr-2 white--text">mdi-bullhorn-outline</v-icon>
            Announcement
          </v-card-title>
          <v-card-text class="text-center headline white--text">
            {{classification.analytics.CA_LENGTH}}
          </v-card-text>
        </v-card>
        
      </v-col>

      <v-col
        class="pa-2"
      >
        <v-card
          elevation="2"
          color="orange darken-4"
        >
        <v-card-title class="caption white--text">
          <v-icon class="mr-2 white--text">mdi-bell-alert-outline</v-icon>
          Casualty Damage
        </v-card-title>
          <v-card-text class="text-center headline white--text">
            {{classification.analytics.CD_LENGTH}}
          </v-card-text>
        </v-card>
        
      </v-col>

      <v-col
        class="pa-2"
      >

        <v-card
          elevation="2"
          color="cyan darken-4"
        >
        <v-card-title class="caption white--text">
          <v-icon class="mr-2 white--text">mdi-account-tie-voice-outline</v-icon>
          Call for Help
        </v-card-title>
          <v-card-text class="text-center headline white--text">
            {{classification.analytics.CH_LENGTH}}
          </v-card-text>
        </v-card>
        
      </v-col>

      <v-col
        class="pa-2"
      >

        <v-card
          elevation="2"
          color="blue-grey darken-4"
        >
        <v-card-title class="caption white--text">Others</v-card-title>
          <v-card-text class="text-center headline white--text">
            {{classification.analytics.O_LENGTH}}
          </v-card-text>
        </v-card>
        
      </v-col>
    </v-row>


    <v-row>
      <v-col>

            <v-card
            elevation="1"
            class="mt-5"
            >
              <v-card-title> 


                <v-select
                  rounded
                  v-model="activechart"
                  :items="items"
                  class="qq"
                  label="Select Chart Style"
                ></v-select>


              </v-card-title>
                <BarChart :ClassifiedList = "toChart" v-if="activechart == 'Bar Chart'"/>
                <PieChart :ClassifiedList = "toChart" v-if="activechart == 'Pie Chart'"/>
            </v-card>

      </v-col>

      <v-col>

        <v-card
        elevation="1"
        class="mt-5"
        >
          <v-card-title>
            <v-select
              v-model="ShowClassifiedWord"
              :items="category"
              class="qq"
              label="Select to Classify Word Cloud"
              rounded
            ></v-select>
          </v-card-title>

          <v-container class="pa-5">

              <vue-word-cloud
              style="
                  height: 255px;
              "
              :words="convert_to_abrevations"
              :color="([, weight]) => weight > 10 ? '#AD5048' : weight > 5 ? '#0C1D24' : '#46373A'"
              font-family="Bahiana"
              rotation-unit="turn"
              />

          </v-container>
        </v-card>

      </v-col>
    </v-row>
</div>
   <div class="d-flex justify-center" v-else>
      <v-img 
      max-height="500"
      max-width="800"
      :src="require('@/assets/analytics.png')">

      </v-img>
   </div>


  </div>
</template>


<script>
import BarChart from '~/components/BarChart.vue';
import PieChart from '~/components/PieChart.vue';
import VueWordCloud from 'vuewordcloud';
export default {
  components: {
    [VueWordCloud.name]: VueWordCloud,
    BarChart,
    PieChart
  },
  data() {
    return {
      userVersion : [],
      versionload: false,
      search: '',
      classification: [],
      toChart: [],
      loadclassification:false,
      ClassfiedWordCloud:[],
      ShowClassifiedWord:'Others',
      category: [
       'Others',
       'Announcement',
       'Call for Help',
       'Casualty and Damage'
      ],
      items:[
        'Bar Chart',
        'Pie Chart'
      ],
      searchtype:[
        'version',
        'tweepy'
      ],
      activechart:'Bar Chart',

      searchactivetype: '',
      searchactiveStatus: false,

      searchStat: false,

      versionSearch: ''

    }
  },
  computed:{
      convert_to_abrevations : function (){

                if(this.ShowClassifiedWord == "Announcement")
                    return this.ClassfiedWordCloud.CA;
                if(this.ShowClassifiedWord == "Others")
                    return this.ClassfiedWordCloud.O;
                if(this.ShowClassifiedWord == "Casualty and Damage")
                    return this.ClassfiedWordCloud.CD;
                if(this.ShowClassifiedWord == "Call for Help")
                    return this.ClassfiedWordCloud.CH;
      },
      validatestring : function (){
        return this.search.replace("#", "%23");
      },
  },
  methods:{

      async get_ai_versions (){
          this.versionload = true;
          this.userVersion = []
          try{
              const versions = await this.$axios.get('/Tweet/get_foruser/');  
              const versionlist = await versions.data;

                if(versions.status == 200){
                  this.userVersion = versionlist;
                }

          }catch {

            alert("Failed loading AI versions");

          }
            this.versionload = false;
      },


      initiate_search : function (){

        
        if(this.searchactivetype == "version"){
          this.search_in_version()
        }

        if(this.searchactivetype == "tweepy"){
            this.search_in_tweepy();
        }

      },

      async search_in_tweepy (){
          this.searchStat = true;
          try{
          this.toChart = [];
          this.loadclassification = true;
          const Classify = await this.$axios.get('/Tweet/getUserAnalytics/?data='+`${this.validatestring}`);
          
          const ClassifyObj = await Classify.data;

          if(Classify.status == 200){
            this.classification = ClassifyObj;
            
            this.toChart.push(
              this.classification.analytics.CA_LENGTH,
              this.classification.analytics.CD_LENGTH,
              this.classification.analytics.CH_LENGTH,
              this.classification.analytics.O_LENGTH,
            )


            this.ClassfiedWordCloud = ClassifyObj.words;

            console.log(this.toChart);
          }

          }catch {
            this.searchStat = false;
            alert("Failed to fetch");
          }
          this.loadclassification = false;
      },

      async search_in_version (){
          this.searchStat = true;
          try{
          this.toChart = [];
          this.loadclassification = true;

          let url = '/Tweet/get_foruser_analytics/?keyword='+`${this.validatestring}`+'&version='+`${this.versionSearch}`
          const Classify = await this.$axios.get(url);
          
          const ClassifyObj = await Classify.data;

          if(Classify.status == 200){
            this.classification = ClassifyObj;
            
            this.toChart.push(
              this.classification.analytics.CA_LENGTH,
              this.classification.analytics.CD_LENGTH,
              this.classification.analytics.CH_LENGTH,
              this.classification.analytics.O_LENGTH,
            )


            this.ClassfiedWordCloud = ClassifyObj.words;

            console.log(this.toChart);
          }

          }catch {
            this.searchStat = false;
            alert("Failed to fetch");
          }
          this.loadclassification = false;
      },
      Resets : function (){
        this.loadclassification = false
        this.searchactiveStatus = false
        this.searchStat = false
        this.searchactivetype = ''
        this.searchactiveStatus = false
        this.ClassfiedWordCloud = []
        this.toChart = []
        this.classification = []
        this.versionSearch = ''
        this.search = ''
      }
  },
  mounted (){
    this.get_ai_versions()
  }
}
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Bahiana&family=Merienda&display=swap');
.qq{
      max-width: 300px;
}

.aa{
      max-width: 200px;
}
.kq{
      max-width: 400px;
}

</style>