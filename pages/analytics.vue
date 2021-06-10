<template>
  <div>


    <v-row no-gutters>
      <v-col
        class="pa-2"
      >

        <v-card
          color="primary"
          elevation="2"
          width="300px"
          height="150px"
        >
        <v-card-title class="caption white--text">Total Classified</v-card-title>
          <v-card-text class="text-center headline white--text p-15 mt-3">
            {{classification.tweetCount}}
          </v-card-text>
        </v-card>
        
      </v-col>
      
      <v-col
        class="pa-2"
      >

        <v-card
          elevation="2"
          color="indigo darken-4"
          height="150px"
        >
          <v-card-title class="caption white--text">
            <v-icon class="mr-2 white--text">mdi-bullhorn-outline</v-icon>
            Announcement
          </v-card-title>
          <v-card-text class="text-center headline white--text mt-3">
            {{classification.caCount}}
          </v-card-text>
        </v-card>
        
      </v-col>

      <v-col
        class="pa-2"
      >

        <v-card
          elevation="2"
          color="orange darken-4"
          height="150px"
        >
        <v-card-title class="caption white--text">
          <v-icon class="mr-2 white--text">mdi-bell-alert-outline</v-icon>
          Casualty Damage
        </v-card-title>
          <v-card-text class="text-center headline white--text mt-3">
            {{classification.cdCount}}
          </v-card-text>
        </v-card>
        
      </v-col>

      <v-col
        class="pa-2"
      >

        <v-card
          elevation="2"
          color="cyan darken-4"
          height="150px"
        >
        <v-card-title class="caption white--text">
          <v-icon class="mr-2 white--text">mdi-account-tie-voice-outline</v-icon>
          Call for Help
        </v-card-title>
          <v-card-text class="text-center headline white--text mt-3">
            {{classification.chCount}}
          </v-card-text>
        </v-card>
        
      </v-col>

      <v-col
        class="pa-2"
      >

        <v-card
          elevation="2"
          color="blue-grey darken-4"
          height="150px"
        >
        <v-card-title class="caption white--text">Others</v-card-title>
          <v-card-text class="text-center headline white--text mt-3">
            {{classification.oCount}}
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
              :words="ClassfiedWordCloud"
              :color="([, weight]) => weight > 10 ? '#AD5048' : weight > 5 ? '#0C1D24' : '#46373A'"
              font-family="Bahiana"
              rotation-unit="turn"
              />

          </v-container>
        </v-card>

      </v-col>
    </v-row>


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
                    return "getCA_WORDS";
                if(this.ShowClassifiedWord == "Others")
                    return "getO_WORDS";
                if(this.ShowClassifiedWord == "Casualty and Damage")
                    return "getCD_WORDS";
                if(this.ShowClassifiedWord == "Call for Help")
                    return "getCH_WORDS";
      },
  },
  watch:{
    ShowClassifiedWord : function (){
      this.loadWordCloud();
    }
  },
  methods:{
    async get_classification (){
        try{
        this.loadclassification = true;
        const Classify = await this.$axios.get('/Tweet/getAnalytics/');
        
         const ClassifyObj = await Classify.data;

        if(Classify.status == 200){
          this.classification = ClassifyObj;
          
          this.toChart = Object.values(ClassifyObj);
          this.toChart.shift();
        }

        }catch {
          alert("Failed to fetch");
        }
        this.loadclassification = false;
    },
    async loadWordCloud (){
        try{
        this.loadclassification = true;
        const Classify = await this.$axios.get('/Tweet/'+`${this.convert_to_abrevations}`+'/');
        
         const ClassifyObj = await Classify.data;

        if(Classify.status == 200){
          this.ClassfiedWordCloud = ClassifyObj.values;
        }

        }catch {
          alert("Failed to fetch");
        }
        this.loadclassification = false;
    },
  },
  created(){
    this.get_classification()
    this.loadWordCloud();
  }
}
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Bahiana&family=Merienda&display=swap');
.qq{
      max-width: 300px;
}

</style>