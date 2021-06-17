<template>
  <div>


    <v-text-field
      :disabled="loadclassification"
      v-model="search"
      rounded
      filled
      :loading="loadclassification"
      label="Search Tweet"
      prepend-inner-icon="mdi-magnify"
      @keyup.enter="get_classification"
      class="kq"
    ></v-text-field>


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
      search: '',
      classification: [],
      toChart: [],
      loadclassification:false,
      ClassfiedWordCloud:[],
      ShowClassifiedWord:'Announcement',
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
      activechart:'Bar Chart'
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
    async get_classification (){
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
          alert("Failed to fetch");
        }
        this.loadclassification = false;
    }
  }
}
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Bahiana&family=Merienda&display=swap');
.qq{
      max-width: 300px;
}

.kq{
      width: 400px;
}

</style>