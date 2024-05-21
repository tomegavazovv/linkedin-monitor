const { HttpsProxyAgent } = require('https-proxy-agent');
const PROXIES = [
  ['107.181.128.87', 5099],
  ['67.227.119.8', 6337],
  ['98.159.38.247', 6547],
  ['206.206.64.76', 6037],
  ['209.127.143.202', 8301],
  ['157.52.187.117', 6057],
  ['38.154.206.248', 9739],
  ['104.223.223.88', 6673],
  ['104.223.223.19', 6604],
  ['147.124.198.172', 6031],
  ['38.153.138.163', 9502],
  ['43.245.119.163', 5937],
  ['64.64.118.72', 6655],
  ['172.245.158.155', 6108],
  ['67.227.119.169', 6498],
  ['142.111.93.144', 6705],
  ['38.153.134.170', 9839],
  ['38.170.173.26', 7577],
  ['188.215.5.221', 5251],
  ['104.245.244.39', 6479],
  ['161.123.93.121', 5851],
  ['104.223.157.69', 6308],
  ['104.239.105.4', 6534],
  ['184.174.46.155', 5784],
  ['154.29.232.238', 6898],
  ['142.111.245.7', 5874],
  ['38.170.190.79', 9430],
  ['157.52.174.41', 6250],
  ['173.214.177.44', 5735],
  ['154.29.235.56', 6397],
  ['38.153.133.56', 9460],
  ['38.170.172.155', 5156],
  ['207.244.218.172', 5780],
  ['38.154.217.43', 7234],
  ['38.154.206.142', 9633],
  ['207.244.217.151', 6698],
  ['89.32.200.38', 6494],
  ['216.173.120.183', 6475],
  ['198.46.246.183', 6807],
  ['154.30.242.235', 9629],
  ['154.30.252.172', 5303],
  ['45.61.124.136', 6465],
  ['198.23.147.130', 5145],
  ['45.41.160.179', 6161],
  ['38.153.137.107', 5415],
  ['104.148.5.28', 6039],
  ['23.247.105.153', 5217],
  ['172.245.157.231', 6816],
  ['207.244.219.209', 6465],
  ['38.170.157.51', 9090],
  ['193.36.172.114', 6197],
  ['198.37.121.157', 6577],
  ['45.141.80.8', 5734],
  ['104.148.5.22', 6033],
  ['38.154.217.250', 7441],
  ['64.64.115.24', 5659],
  ['173.214.177.185', 5876],
  ['173.211.0.184', 6677],
  ['172.245.158.111', 6064],
  ['192.210.191.233', 6219],
  ['38.153.134.55', 9724],
  ['67.227.119.228', 6557],
  ['38.170.157.132', 9171],
  ['45.61.124.23', 6352],
  ['64.64.118.7', 6590],
  ['142.111.245.221', 6088],
  ['142.111.245.115', 5982],
  ['142.147.128.58', 6558],
  ['23.247.7.254', 5927],
  ['198.23.239.168', 6574],
  ['198.46.161.42', 5092],
  ['157.52.145.138', 5747],
  ['198.37.121.105', 6525],
  ['157.52.212.194', 6097],
  ['43.245.117.150', 5734],
  ['45.141.83.249', 6613],
  ['142.111.245.186', 6053],
  ['45.41.179.186', 6721],
  ['161.123.101.211', 6837],
  ['104.232.209.209', 6167],
  ['104.143.248.103', 6713],
  ['38.154.227.116', 5817],
  ['142.111.1.13', 5045],
  ['154.30.241.103', 9814],
  ['107.179.26.146', 6216],
  ['154.30.241.241', 9952],
  ['104.223.227.103', 6626],
  ['142.147.131.146', 6046],
  ['157.52.187.100', 6040],
  ['38.154.217.247', 7438],
  ['136.0.109.84', 6370],
  ['107.172.163.10', 6526],
  ['38.170.190.63', 9414],
  ['206.206.73.180', 6796],
  ['23.247.7.237', 5910],
  ['43.245.119.70', 5844],
  ['134.73.188.25', 5115],
  ['104.239.124.209', 6487],
  ['64.64.127.146', 6099],
  ['43.245.117.51', 5635],
  ['142.147.132.41', 6236],
  ['167.160.180.35', 6586],
  ['45.41.179.95', 6630],
  ['161.123.154.19', 6549],
  ['198.46.246.22', 6646],
  ['38.153.134.79', 9748],
  ['104.148.0.218', 5573],
  ['157.52.233.49', 5676],
  ['173.0.9.188', 5771],
  ['206.206.69.193', 6457],
  ['154.30.242.194', 9588],
  ['107.173.137.243', 6497],
  ['142.147.245.29', 5720],
  ['38.170.159.94', 6685],
  ['154.29.239.233', 6272],
  ['38.170.159.191', 6782],
  ['142.111.245.167', 6034],
  ['198.23.239.124', 6530],
  ['198.37.121.221', 6641],
  ['104.143.248.130', 6740],
  ['154.29.239.205', 6244],
  ['198.154.89.185', 6276],
  ['104.143.252.14', 5628],
  ['104.239.106.97', 5742],
  ['142.147.131.13', 5913],
  ['45.61.124.43', 6372],
  ['136.0.109.160', 6446],
  ['198.46.246.168', 6792],
  ['198.12.112.102', 5113],
  ['198.46.161.216', 5266],
  ['38.170.172.242', 5243],
  ['45.61.123.174', 5853],
  ['104.239.105.67', 6597],
  ['172.245.158.104', 6057],
  ['206.206.124.165', 6746],
  ['184.174.46.60', 5689],
  ['38.153.134.242', 9911],
  ['107.172.163.76', 6592],
  ['45.61.121.55', 6654],
  ['207.244.217.72', 6619],
  ['104.239.104.83', 6307],
  ['172.245.157.180', 6765],
  ['64.64.115.21', 5656],
  ['157.52.145.132', 5741],
  ['104.238.50.116', 6662],
  ['198.46.246.128', 6752],
  ['134.73.188.79', 5169],
  ['173.214.176.48', 6019],
  ['107.179.26.245', 6315],
  ['198.154.89.220', 6311],
  ['157.52.212.176', 6079],
  ['104.233.26.234', 6072],
  ['192.3.48.232', 6225],
  ['198.46.161.95', 5145],
  ['142.147.244.149', 6393],
  ['198.37.99.253', 6044],
  ['23.94.138.5', 6279],
  ['157.52.145.247', 5856],
  ['206.206.69.225', 6489],
  ['64.64.115.32', 5667],
  ['184.174.46.67', 5696],
  ['103.47.53.41', 8339],
  ['66.78.32.76', 5126],
  ['104.239.81.176', 6711],
  ['38.170.157.1', 9040],
  ['23.94.138.132', 6406],
  ['45.127.250.46', 5655],
  ['89.32.200.210', 6666],
  ['206.206.119.173', 6084],
  ['107.172.163.226', 6742],
  ['142.111.1.72', 5104],
  ['38.170.173.149', 7700],
  ['23.247.105.143', 5207],
  ['142.147.131.221', 6121],
  ['147.185.250.48', 6834],
  ['45.41.160.104', 6086],
  ['192.210.191.198', 6184],
  ['198.23.214.169', 6436],
  ['142.147.131.11', 5911],
  ['107.172.163.58', 6574],
  ['104.148.0.223', 5578],
  ['172.245.157.236', 6821],
  ['184.174.46.216', 5845],
  ['142.111.245.102', 5969],
  ['38.154.200.147', 5848],
  ['104.223.157.239', 6478],
  ['104.239.124.68', 6346],
  ['154.29.233.7', 5768],
  ['207.244.219.38', 6294],
  ['142.111.245.11', 5878],
  ['142.147.131.169', 6069],
  ['45.41.160.172', 6154],
  ['104.238.37.134', 6691],
  ['198.46.246.252', 6876],
  ['188.215.5.111', 5141],
  ['38.153.134.46', 9715],
  ['204.44.69.168', 6421],
  ['104.245.244.46', 6486],
  ['198.46.241.92', 6627],
  ['104.223.171.105', 6396],
  ['43.229.9.232', 6501],
  ['104.233.26.195', 6033],
  ['104.238.37.87', 6644],
  ['38.153.156.129', 9812],
  ['172.245.157.206', 6791],
  ['157.52.212.226', 6129],
  ['154.30.252.198', 5329],
  ['104.148.5.129', 6140],
  ['198.37.98.225', 5755],
  ['64.64.127.250', 6203],
  ['198.23.147.168', 5183],
  ['206.206.69.5', 6269],
  ['104.223.157.217', 6456],
  ['173.0.9.46', 5629],
  ['157.52.174.108', 6317],
  ['134.73.18.4', 6587],
  ['142.147.128.103', 6603],
  ['69.58.12.22', 8027],
  ['104.143.251.3', 6265],
  ['45.127.250.36', 5645],
  ['104.239.81.195', 6730],
  ['142.147.128.224', 6724],
  ['173.0.10.87', 6263],
  ['161.123.93.110', 5840],
  ['206.206.73.83', 6699],
  ['104.223.149.239', 5867],
  ['38.153.140.43', 8921],
  ['104.148.5.32', 6043],
  ['38.170.189.182', 9748],
  ['134.73.188.31', 5121],
  ['104.143.249.72', 6046],
  ['45.141.83.53', 6417],
  ['45.41.179.21', 6556],
  ['107.172.163.3', 6519],
  ['167.160.180.102', 6653],
  ['216.173.120.148', 6440],
  ['45.41.179.19', 6554],
  ['104.223.171.94', 6385],
  ['38.154.206.24', 9515],
  ['206.206.124.151', 6732],
  ['104.223.227.174', 6697],
  ['206.206.64.189', 6150],
  ['134.73.52.141', 6801],
  ['45.141.83.5', 6369],
  ['161.123.101.226', 6852],
  ['98.159.38.169', 6469],
  ['103.47.53.163', 8461],
  ['104.223.157.119', 6358],
  ['198.46.246.44', 6668],
  ['104.223.227.190', 6713]
];

const webShareKrsteUrl = 'http://yvcogkkm-rotate:j6gk73sbqn3w@p.webshare.io:80';
const webShareKrsteProxyAgent = new HttpsProxyAgent(webShareKrsteUrl);

module.exports = () => webShareKrsteProxyAgent;
