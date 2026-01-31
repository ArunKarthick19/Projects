import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity, Modal, StatusBar, ScrollView } from 'react-native';
import axios from 'axios';
import ImageViewer from 'react-native-image-zoom-viewer';
import { SafeAreaView } from 'react-native-safe-area-context';
import stationMarkers from './stationMarkerscopy.js';
import bplrtStationMarkers from './bpstationmarkerscopy.js';
import punggolStationMarkers from './punggolstationmarkerscopy.js'; // Import Punggol station markers


// Import images
import AppIcon from "./assets/OnTrack_Icon_removebg.png";
import MRT_Map from './assets/MRT_Map.png';
import BPLRT_Map from './assets/bplrt.jpg';
import PGLRT_Map from './assets/pglrt.jpg';

// Crowd level icons
import LowCrowdIcon from './assets/low_crowd.png';
import MediumCrowdIcon from './assets/medium_crowd.png';
import HighCrowdIcon from './assets/high_crowd.png';

//lol
// Get the screen width to make the image responsive
const { width: screenWidth } = Dimensions.get('window');

const images = [
  {
    props: {
      source: MRT_Map, // Local image
    },
  },
];

// Start building of the app!!!
// This is the main component of the app
const HomePageUI = () => {
  
  // State to manage the selected station
  const [selectedStation, setSelectedStation] = useState(null);
  
  // State to manage the modal visibility
  const [modalVisible, setModalVisible] = useState(false);

  // State to manage the LRT modals
  const [bplrtModalVisible, setBplrtModalVisible] = useState(false);
  const [pglrtModalVisible, setPglrtModalVisible] = useState(false);
  const [activeMap, setActiveMap] = useState('MRT');
  
  // Function to fetch station details from the backend
  const fetchStationDetails = async (stationCode) => {
    try {
      const response = await axios.get(`http://192.168.18.11:5000/api/station/${stationCode}`);
      setSelectedStation(response.data);
      setModalVisible(true);
    } catch (error) {
      console.error("Error fetching station details:", error);
    }
  };

// Function to handle station press
const handleStationPress = (stationCode) => {
  console.log('Station clicked:', stationCode);
  if(['BP1', 'BP2'].includes(stationCode)) {
    setBplrtModalVisible(true);
  }
  else if(['PG1', 'PG2', 'PG3', 'PG4'].includes(stationCode)) {
    setPglrtModalVisible(true);
  }
  else {
    fetchStationDetails(stationCode);
  }
};


const handleBplrtStationPress = (stationCode) => {
  console.log('Station clicked:', stationCode);
  setBplrtModalVisible(false); // Close BPLRT modal
  fetchStationDetails(stationCode); // Fetch details for BPLRT stations
};

// Function to handle Punggol LRT station press
const handlePunggolStationPress = (stationCode) => {
  console.log('Station clicked:', stationCode);
  setPglrtModalVisible(false); // Close PGLRT modal
  fetchStationDetails(stationCode); // Fetch details for Punggol LRT stations
};

  // Frontend (Everything shown on the screen)
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>

        {/* Header Section with Background Circles */}
        <View style={styles.headerContainer}>
          {/* Background Circles */}
          <View style={styles.circleContainer}>
            <View style={[styles.circle, styles.circleDarkBlue]} />
            <View style={[styles.circle, styles.circleLightBlue]} />
          </View>

          {/* App Icon, Title, and Tagline */}
          <View style={styles.headerContent}>
            <Image source={AppIcon} style={styles.iconImage} />
          </View>

          {/* Hello Text */}
          <Text style={styles.hello}>Hello!</Text>
        </View>

        <Text style={styles.subtitle}>Which MRT station would you like information about?</Text>
        <View style={styles.mapContainer}>
          <ImageViewer
            imageUrls={images}
            enableSwipeDown={true}
            style={styles.mapImage}
            backgroundColor="#fff"
            renderIndicator={() => null}
            renderImage={(props) => (
              <View style={{ position: 'relative', width: '100%', height: '100%' }}>
                <Image {...props} style={{ width: '100%', height: '100%' }} />
                <View style={styles.stationMarkerFixed}>
                  {stationMarkers.map((station) => (
                    <TouchableOpacity
                      key={station.code}
                      style={[
                        styles.stationBox,
                        station.style,
                        { position: 'absolute', left: station.position.x, top: station.position.y }
                      ]}
                      onPress={() => handleStationPress(station.code)}
                    >
                      {/* Make the text color transparent to hide it */}
                    <Text style={[styles.stationText, { color: 'transparent' }]}>
                      {station.code}
                    </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          />
        </View>

            {/* Modal for BPLRT */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={bplrtModalVisible}
        onRequestClose={() => setBplrtModalVisible(false)}
      >
        <SafeAreaView style={styles.fullScreenModalContainer}>
          <StatusBar barStyle="dark-content" />
          
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setBplrtModalVisible(false)}
            >
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.mapContainer}>
            <Image
              source={BPLRT_Map}
              style={styles.lrtFullScreenImage}
              resizeMode="contain"
            />
            {/* BPLRT Station markers */}
            <View style={styles.stationMarkerFixed}>
              {bplrtStationMarkers.map((station) => (
                <TouchableOpacity
                  key={station.code}
                  style={[
                    styles.stationBox,
                    station.style,
                    { position: 'absolute', left: station.position.x, top: station.position.y }
                  ]}
                  onPress={() => handleBplrtStationPress(station.code)}
                >
                  {/* Make the text color transparent to hide it */}
                  <Text style={[styles.stationText, { color: 'transparent' }]}>
                      {station.code}
                    </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Modal for PGLRT */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={pglrtModalVisible}
        onRequestClose={() => setPglrtModalVisible(false)}
      >
        <SafeAreaView style={styles.fullScreenModalContainer}>
          <StatusBar barStyle="dark-content" />
          
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setPglrtModalVisible(false)}
            >
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.mapContainer}>
            <Image
              source={PGLRT_Map}
              style={styles.lrtFullScreenImage}
              resizeMode="contain"
            />
            {/* PGLRT Station markers */}
            <View style={styles.stationMarkerFixed}>
              {punggolStationMarkers.map((station) => (
                <TouchableOpacity
                  key={station.code}
                  style={[
                    styles.stationBox,
                    station.style,
                    { position: 'absolute', left: station.position.x, top: station.position.y }
                  ]}
                  onPress={() => handlePunggolStationPress(station.code)}
                >
                 {/* Make the text color transparent to hide it */}
                 <Text style={[styles.stationText, { color: 'transparent' }]}>
                      {station.code}
                    </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </SafeAreaView>
      </Modal>

      {selectedStation && (
  <Modal
    animationType="slide"
    transparent={false}
    visible={modalVisible}
    onRequestClose={() => setModalVisible(false)}
  >
    <SafeAreaView style={styles.fullScreenModalContainer}>
      <StatusBar barStyle="dark-content" />
      <ScrollView>
        {/* Background Circles */}
        <View style={styles.circleContainer}>
            <View style={[styles.circle, styles.circleDarkBlue]} />
            <View style={[styles.circle, styles.circleLightBlue]} />
          </View>
        <View style={styles.stationInfoContainer}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setModalVisible(false)}
            >
              
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
            <View style={styles.stationCodeBadge}>
              <Text style={styles.stationCodeText}>{selectedStation.code}</Text>
            </View>
            {/* <Text style={styles.stationNameText}>{selectedStation.name || selectedStation.station_name}</Text> */}
            <Image source={AppIcon} style={styles.modalimage} />
          </View>



           {/* --- Crowd Level --- */}
           {selectedStation.crowdness_level && selectedStation.crowdness_level !== "No data" && (
            <View style={styles.crowdLevelSection}>
              <Text style={styles.sectionTitle}>Current Crowd Level</Text>
              <View style={styles.crowdLevelBox}>
                <Image
                  source={
                    selectedStation.crowdness_level.toLowerCase() === 'l'
                      ? LowCrowdIcon
                      : selectedStation.crowdness_level.toLowerCase() === 'm'
                      ? MediumCrowdIcon
                      : selectedStation.crowdness_level.toLowerCase() === 'h'
                      ? HighCrowdIcon
                      : null
                  }
                  style={styles.crowdLevelIcon}
                />

            <Text style={styles.crowdLabel}>
                {selectedStation.crowdness_level.toLowerCase() === 'l'
                  ? 'Low congestion – Light crowding with seating available'
                  : selectedStation.crowdness_level.toLowerCase() === 'm'
                  ? 'Moderate congestion – Standing likely, limited seats'
                  : selectedStation.crowdness_level.toLowerCase() === 'h'
                  ? 'High congestion – Heavy crowding with little to no standing space'
                  : 'Data not available'}
              </Text>
              </View>
            </View>
          )}

        <View style={styles.barContainer}>
            <Text style={styles.trainTimesTitle}>Train Timings</Text>
        </View>
          {/* --- Train Timings Section --- */}
          <View style={styles.trainTimesContainer}>
            
            {/* Check if station_details exists and is an object */}
            {selectedStation.station_details && typeof selectedStation.station_details === 'object' &&
              Object.keys(selectedStation.station_details).map((lineName, lineIndex) => {
                const lineDetails = selectedStation.station_details[lineName];
                
                return (
                  <View key={lineIndex} style={styles.lineContainer}>
                    
                    {/* Removed line name rendering */}
                    {Object.keys(lineDetails || {}).map((stationName, stationIndex) => {
                      const schedule = lineDetails[stationName];
                      
                      // Check if schedule exists before accessing its properties
                      if (!schedule) return null;
                      
                      return (
                        <View key={stationIndex} style={styles.destinationContainer}>
                          <View style={styles.bar2}>
                          <Text style={styles.destinationText}>Towards {stationName}</Text>
                          </View>
                          {/* Table Header */}
                          <View style={styles.tableRow}>
                            <Text style={styles.first}>     First                      Last</Text>
                          </View>
                          
                          {["Monday - Friday", "Saturday", "Sunday", "Public Holiday"].map((day, i) => (
                            <View key={i} style={styles.tableRow}>
                              <Text style={styles.dayColumn}>{day}</Text>
                              <Text style={styles.timeColumn}>
                                {schedule.first_train && schedule.first_train[day] || "-"}
                              </Text>
                              <Text style={styles.timeColumn}>
                                {schedule.last_train && schedule.last_train[day] || "-"}
                              </Text>
                            </View>
                          ))}
                        </View>
                      );
                    })}
                  </View>
                );
              })
            }
          </View>

         
        </View>
      </ScrollView>
    </SafeAreaView>
  </Modal>
)}







      </View>
    </SafeAreaView>
  );
};

// Styles for the app
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mapContainer: {
    flex: 1,
    marginVertical: 10,
  },
  // Header Section Styles
  headerContainer: {
    position: 'relative',
    paddingTop: 20,
  },
  circleContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: 250, // Adjust height to fit circles
  },
  circle: {
    position: 'absolute',
    borderRadius: 500, // Large enough to make it a circle
  },
  circleLightBlue: {
    width: 250,
    height: 250,
    backgroundColor: '#5FB3F9', // Light blue color
    top: -150,
    left: -30,
  },
  circleDarkBlue: {
    width: 250,
    height: 250,
    backgroundColor: '#1D4AA7', // Dark blue color
    top: -75,
    left: -80,
  },
  headerContent: {
    alignItems: 'flex-end',
    marginRight: 10,
  },
  iconImage: {
    width: 150,
    height: 150,
    alignSelf: 'flex-end',
    marginRight: 10,
  },
  hello: {
    fontSize: 50,
    fontWeight: 'bold',
    textAlign: 'right',
    marginRight: 25,
  },
  subtitle: {
    color: 'black',
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'left',
    marginLeft: 20,
    marginRight: 20,
  },
  mapImage: {
    width: screenWidth,
    height: '100%',
  },
  stationMarkerFixed: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 9999,
  },
  stationBox: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
  stationText: {
    fontSize: 10,
  },
  bplrtImage: {
    width: '100%',
    height: '100%',
  },
  // Full screen modal styles
  fullScreenModalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: 0,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    paddingVertical: 8,
    paddingRight: 15,
  },
  backButtonText: {
    fontSize: 16,
    color: '#021743',
    fontWeight: '500',
  },
  stationInfoContainer: {
    flex: 1,
  },
  stationCodeBadge: {
    backgroundColor: '#0033A0',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
    marginRight: 10,
    marginTop: 20,
  },
  stationCodeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  stationNameText: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  // Train times section
  trainTimesContainer: {
    margin: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  trainTimesHeader: {
    backgroundColor: '#0033A0',
    padding: 10,
  },
  trainTimesTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
  },
  destinationContainer: {
    marginBottom: 0,
    borderBottomWidth: 0,
    borderBottomColor: '#e0e0e0',
  },
  destinationHeader: {
    backgroundColor: '#e6eeff',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#d0d0d0',
  },
  destinationText: {
    color: 'white',
    paddingLeft: 103,
    fontWeight: '600',
    fontSize: 15,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 0,
    borderBottomColor: '#9B4141',
  },

  first: {
    flexDirection: 'row',
    borderBottomWidth: 0,
    borderBottomColor: '#9B4141',
    paddingLeft: 140
  },

 
  dayColumn: {
    flex: 1.5,
    padding: 10,
    justifyContent: 'center',
    borderRightColor: '#e0e0e0',
  },
  timeColumn: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  columnHeaderText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  dayText: {
    fontSize: 14,
  },
  timeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  // Crowd level styles
  crowdLevelIcon: {
    width: 40, // Adjust size as needed
    height: 40, // Adjust size as needed
    resizeMode: 'contain',
  },
  crowdLevelSection: {
    margin: 15,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  crowdLevelText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  // LRT styles
  lrtFullScreenImage: {
    width: '100%',
    height: '100%',
  },

  modalimage: {
    width: 80,
    height: 80,
    marginLeft: 130,
    

  },

  bar2: {
    backgroundColor: '#007AFF', // iOS blue (or use any hex code)
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 0, // Remove border radius to make it fill the width
    marginVertical: 0, // Remove vertical margin to eliminate space
    width: '100%', // Ensure the bar fills the entire width
  },

    barContainer: {
      backgroundColor: '#1D4AA7',  
      paddingVertical: 15,         
      alignItems: 'center',        
      justifyContent: 'center',    
    },

});

export default HomePageUI;