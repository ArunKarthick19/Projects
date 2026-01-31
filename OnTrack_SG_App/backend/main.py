from flask import Flask, jsonify, request
import requests
import datetime
import logging
import re
from flask_cors import CORS
from stationdata2 import station_data  # Assuming station_data is a module with the station data


# Setup logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# API endpoints
PCD_URL = 'https://datamall2.mytransport.sg/ltaodataservice/PCDRealTime'
TRAIN_SERVICE_ALERT_URL = 'https://datamall2.mytransport.sg/ltaodataservice/TrainServiceAlerts'

# Headers with Account Key
AK = {
    'AccountKey': 'qTB6383nRQ65AWSJS8PbZg=='  # Insert your AccountKey here. You may get your account key from LTA Data Mall
}
#I didn't include the account key in the code for security reasons. Please make sure to add your own account key here.

# Hardcoded station data
# station_data = {
#     "NS2": {
#         "name": "Bukit Batok",
#         "code": "NS2",
#         "SearchCode": "NS2",
#         "line": "NSL",
#         "details": "Located in the Bukit Batok planning area"
#     },
#     "EW24NS1": {
#         "name": "Jurong East",
#         "code": "EW24/NS1",
#         "SearchCode": "EW24",
#         "line": "EWL",
#         "details": "Interchange station in the Jurong East area"
#     },
#       "SW5": {
#         "name": "fernvale LRT",
#         "code": "TFLRT",
#         "SearchCode": "SW5",
#         "line": "SLRT",
#         "details": "Fernvale LRT"
#     },

#      "BP7": {
#         "name": "Petir LRT",
#         "code": "TFLRT",
#         "SearchCode": "BP7",
#         "line": "BPL",
#         "details": "Petir LRT"
#     }
# }

# Endpoint to get crowdness data (PCD data)
@app.route('/api/pcd', methods=['GET'])
def get_pcd_data():
    try:
        station_line = request.args.get('TrainLine')
        logger.debug(f"PCD API called with TrainLine: {station_line}")
        
        if not station_line:
            return jsonify({"error": "TrainLine is required"}), 400
        
        # We query the external API with the header (AccountKey) and the query parameter (TrainLine)
        logger.debug(f"Calling LTA API at {PCD_URL}")
        response = requests.get(PCD_URL, headers=AK, params={'TrainLine': station_line})
        response.raise_for_status()  # Raise exception for HTTP errors
        
        # Parse the JSON response from the external API
        pcd_data = response.json()
        return jsonify(pcd_data)
    except requests.exceptions.RequestException as e:
        logger.error(f"PCD API error: {str(e)}")
        return jsonify({"error": f"Error fetching PCD data: {str(e)}"}), 500
    except Exception as e:
        logger.error(f"Unexpected error in PCD API: {str(e)}")
        return jsonify({"error": f"Unexpected error: {str(e)}"}), 500



@app.route('/api/station/<station_code>', methods=['GET'])
def get_station(station_code):
    try:
        logger = logging.getLogger(__name__)
        logger.debug(f"Station API called for station code: {station_code}")

        # Get station info from station_data
        station = station_data.get(station_code.upper())
        if not station:
            return jsonify({"error": "Station not found"}), 404

        # Get the station name and code
        station_name = station.get("name")
        logger.debug(f"Station name: {station_name}")
        code = station.get("code")

        # Check if station has multiple lines
        station_line = station.get("line", "")
        station_lines = station_line.split("/") if "/" in station_line else [station_line]

        # Prepare details dictionary for storing all line info
        all_station_details = {}
        all_stations = []

        for line in station_lines:
            details = station.get("details", {}).get(line, {})
            if not details:
                continue

            # Extract first and last train schedules
            first_train = details.get("first_train", {})
            last_train = details.get("last_train", {})

            # Combine station names (from both first and last train details)
            stations = sorted(set(first_train.keys()).union(last_train.keys()))
            all_stations.extend(stations)  # Add to overall stations list

            # Structure the response to include first and last train details
            station_details = {}
            for station_name in stations:
                station_details[station_name] = {
                    "first_train": {
                        "Monday - Friday": first_train.get(station_name, {}).get("Monday - Friday", "    -"),
                        "Saturday": first_train.get(station_name, {}).get("Saturday", "    -"),
                        "Sunday": first_train.get(station_name, {}).get("Sunday", "    -"),
                        "Public Holiday": first_train.get(station_name, {}).get("Public Holiday", "    -"),
                    },
                    "last_train": {
                        "Monday - Friday": last_train.get(station_name, {}).get("Monday - Friday", "    -"),
                        "Saturday": last_train.get(station_name, {}).get("Saturday", "    -"),
                        "Sunday": last_train.get(station_name, {}).get("Sunday", "    -"),
                        "Public Holiday": last_train.get(station_name, {}).get("Public Holiday", "    -"),
                    }
                }
            
            # Add this line's details to overall details
            all_station_details[line] = station_details

        # Fetch PCD data (crowd levels)
        pcd_response = requests.get(PCD_URL, headers=AK, params={'TrainLine': ",".join(station_lines)})
        pcd_data = pcd_response.json().get('value', [])

        # Match crowd data for the current station
        crowd_level = "Unknown"
        search_code = station.get("SearchCode", "").upper()
        for item in pcd_data:
            if item.get("Station").upper() == search_code:
                crowd_level = item.get("CrowdLevel", "Unknown")
                break

        # Respond with station details and crowd level
        return jsonify({
            "name": station_name,
            "stations": sorted(set(all_stations)),  # Remove duplicates
            "station_details": all_station_details,
            "code": code,
            "crowdness_level": crowd_level,
            "lines": station_lines
        })  

    except requests.exceptions.RequestException as e:
        logger.error(f"PCD API request error: {str(e)}")
        return jsonify({"error": f"Error fetching PCD data: {str(e)}"}), 500
    except Exception as e:
        logger.error(f"Unexpected error in Station API: {str(e)}")
        return jsonify({"error": f"Unexpected error: {str(e)}"}), 500



# Service alerts endpoint based on LTA documentation
@app.route('/api/service-alerts', methods=['GET'])
def get_service_alerts():
    try:
        logger.info("Fetching train service alerts...")
        response = requests.get(TRAIN_SERVICE_ALERT_URL, headers=AK)
        
        # Log response details for debugging
        logger.debug(f"Response status: {response.status_code}")
        if response.status_code != 200:
            logger.error(f"Error response: {response.text}")
            return jsonify({
                "data": [{
                    "message": "Unable to fetch service alerts at this time",
                    "timestamp": datetime.datetime.now().isoformat(),
                    "affected_lines": "Unknown",
                    "severity": "Unknown"
                }]
            }), 200
        
        # Safely handle the JSON response
        try:
            alerts_data = response.json()
            logger.debug(f"API returned data: {alerts_data}")
        except ValueError:
            # Handle case where response is not valid JSON
            logger.error(f"Invalid JSON in response: {response.text[:500]}")
            return jsonify({
                "data": [{
                    "message": f"Invalid response format from service alerts API",
                    "timestamp": datetime.datetime.now().isoformat(),
                    "affected_lines": "System",
                    "severity": "Error"
                }]
            }), 200
        
        # Handle the case where there are no alerts or unexpected response format
        if not isinstance(alerts_data, dict) or 'value' not in alerts_data:
            logger.warning(f"Unexpected API response format: {alerts_data}")
            return jsonify({
                "data": [{
                    "message": "No service disruptions reported at this time",
                    "timestamp": datetime.datetime.now().isoformat(),
                    "affected_lines": "All Lines",
                    "severity": "Normal"
                }]
            })
        
        # Process each alert
        processed_alerts = []
        for alert in alerts_data.get('value', []):
            # Make sure alert is a dictionary
            if not isinstance(alert, dict):
                logger.warning(f"Alert item is not a dictionary: {alert}")
                continue
                
            status = alert.get('Status')
            line = alert.get('Line', 'Unknown')
            direction = alert.get('Direction', 'Unknown')
            stations = alert.get('Stations', '')
            
            # Safely handle message which might be a string or dict
            message_content = "No details available"
            created_date = datetime.datetime.now().isoformat()
            
            message = alert.get('Message', {})
            if isinstance(message, dict):
                message_content = message.get('Content', message_content)
                created_date = message.get('CreatedDate', created_date)
            elif isinstance(message, str):
                message_content = message
            
            # Determine severity based on Status
            if status == "1":
                severity = "Normal"
            elif status == "2":
                severity = "Disruption"
            else:
                severity = "Unknown"
            
            # Further refine severity based on message content
            if isinstance(message_content, str):  # Add this check
                lower_message = message_content.lower()
                if "delay" in lower_message:
                    severity = "Delay"
                elif "closure" in lower_message:
                    severity = "Closure"
            
            # Format affected stations for display
            affected_stations = []
            if isinstance(stations, str) and stations:  # Add check for string type
                affected_stations = stations.split(',')
            stations_count = len(affected_stations)
            
            # Create summary for affected lines/stations
            if stations_count > 0:
                affected_summary = f"{line} ({stations_count} stations affected)"
            else:
                affected_summary = line
            
            # Handle MRT shuttle direction
            shuttle_direction = alert.get('MRTShuttleDirection', '')
            
            processed_alert = {
                "message": message_content,
                "timestamp": created_date,
                "affected_lines": affected_summary,
                "severity": severity,
                "direction": direction,
                "stations": affected_stations,
                "free_public_bus": alert.get('FreePublicBus', ''),
                "free_mrt_shuttle": alert.get('FreeMRTShuttle', ''),
                "shuttle_direction": shuttle_direction
            }
            
            processed_alerts.append(processed_alert)
        
        # If we processed no alerts, return a "normal status" message
        if not processed_alerts:
            return jsonify({
                "data": [{
                    "message": "No service disruptions reported at this time",
                    "timestamp": datetime.datetime.now().isoformat(),
                    "affected_lines": "All Lines",
                    "severity": "Normal"
                }]
            })
            
        return jsonify({"data": processed_alerts})
    except requests.exceptions.RequestException as e:
        logger.error(f"Service Alerts API RequestException: {str(e)}")
        return jsonify({
            "data": [{
                "message": f"Error retrieving service alerts: {str(e)}",
                "timestamp": datetime.datetime.now().isoformat(),
                "affected_lines": "System",
                "severity": "Error"
            }]
        }), 200
    except Exception as e:
        logger.error(f"Exception in get_service_alerts: {str(e)}")
        import traceback
        traceback.print_exc()
        
        # Return a properly formatted error response
        return jsonify({
            "data": [{
                "message": f"Error retrieving service alerts: {str(e)}",
                "timestamp": datetime.datetime.now().isoformat(),
                "affected_lines": "System",
                "severity": "Error"
            }]
        }), 200

# API key validation endpoint
@app.route('/api/validate-key', methods=['GET'])
def validate_api_key():
    try:
        # Try a simple request to see if your API key works
        logger.debug("Testing API key validity")
        response = requests.get(PCD_URL, headers=AK, params={'TrainLine': 'NSL'})
        
        if response.status_code == 200:
            data_preview = response.json()
            return jsonify({
                "status": "success",
                "message": "API key is valid",
                "response_preview": {
                    "status_code": response.status_code,
                    "data_sample": data_preview.get('value', [])[:2] if 'value' in data_preview else {}
                }
            })
        else:
            return jsonify({
                "status": "error",
                "message": f"API key validation failed with status code: {response.status_code}",
                "response": response.text
            })
    except Exception as e:
        logger.error(f"API key validation error: {str(e)}")
        return jsonify({
            "status": "error",
            "message": f"API key validation threw an exception: {str(e)}"
        })

# Test endpoint to verify the API is running
@app.route('/api/test', methods=['GET'])
def test_api():
    logger.debug("Test API endpoint called")
    return jsonify({
        "status": "success",
        "message": "API is running",
        "time": datetime.datetime.now().isoformat()
    })

if __name__ == '__main__':
    logger.info("Starting Flask application")
    app.run(host='0.0.0.0', port=5000, debug=True)