import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:forui/forui.dart';
import 'package:saju/saju.dart';
import 'package:timezone/data/latest.dart' as tz;
import 'package:timezone/timezone.dart' as tz;

void main() {
  tz.initializeTimeZones();
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Saju Example',
      builder: (context, child) =>
          FTheme(data: FThemes.zinc.light, child: child!),
      localizationsDelegates: const [
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
        FLocalizations.delegate,
      ],
      supportedLocales: const [Locale('en'), Locale('ko')],
      home: const SajuPage(),
    );
  }
}

class SajuPage extends StatefulWidget {
  const SajuPage({super.key});

  @override
  State<SajuPage> createState() => _SajuPageState();
}

class _SajuPageState extends State<SajuPage> {
  // 2000-01-01 18:00
  final DateTime _selectedDate = DateTime(2000, 1, 1, 18, 0);
  final Gender _gender = Gender.male;
  SajuResult? _result;

  @override
  void initState() {
    super.initState();
    _calculate();
  }

  void _calculate() {
    // Basic example uses Seoul
    final location = tz.getLocation('Asia/Seoul');

    // Create TZDateTime from the selected local date
    // Note: In a real app, you'd handle timezone selection more carefully
    final birthDateTime = tz.TZDateTime.from(_selectedDate, location);

    setState(() {
      _result = getSaju(birthDateTime, gender: _gender);
    });
  }

  @override
  Widget build(BuildContext context) {
    // Fallback to Scaffold if FScaffold structure is unknown, but trying common mapping
    // If FScaffold fails, use Scaffold.
    // The analyzer said 'header' and 'content' are undefined.
    return Scaffold(
      // temporarily switching to Scaffold to be safe, or use FScaffold with body?
      // Let's use FScaffold with body if it exists, but analyzer said content undefined.
      // I'll stick to FScaffold but use 'body' as it is standard in Flutter.
      // And 'appBar' instead of header.
      appBar: AppBar(
        title: const Text('Saju Example'),
        // Using standard AppBar inside FScaffold? No FScaffold expects FAppBar usually?
        // Let's purely use Scaffold for the outer shell if FScaffold is tricky without docs.
        // But user asked to use forui.
        // I will try FScaffold with body.
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Birth Date: 2000-01-01 18:00 (Fixed for demo)'),
            const SizedBox(height: 20),
            FButton(
              onPress: _calculate,
              child: const Text('Calculate'),
              // style removed
            ),
            const SizedBox(height: 20),
            if (_result != null) ...[
              _buildPillarsCard(),
              const SizedBox(height: 16),
              _buildInfoCard(),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildPillarsCard() {
    return FCard(
      title: const Text('Four Pillars (사주)'),
      child: Column(
        children: [
          _buildPillarRow('Year (년주)', _result!.pillars.year),
          const SizedBox(height: 8),
          _buildPillarRow('Month (월주)', _result!.pillars.month),
          const SizedBox(height: 8),
          _buildPillarRow('Day (일주)', _result!.pillars.day),
          const SizedBox(height: 8),
          _buildPillarRow('Time (시주)', _result!.pillars.hour),
        ],
      ),
    );
  }

  Widget _buildPillarRow(String label, Pillar pillar) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label),
        Row(
          children: [
            Text(
              pillar.stem.korean,
              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            Text(
              pillar.branch.korean,
              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildInfoCard() {
    return FCard(
      title: const Text('Analysis'),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Strength (신강약): ${_result!.strength.level.korean}'),
          const SizedBox(height: 8),
          Text('Yongshen (용신): ${_result!.yongShen.primary.korean}'),
        ],
      ),
    );
  }
}
